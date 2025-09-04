class Dashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.user = JSON.parse(localStorage.getItem("user"));
    if (!this.user || this.user.role !== "store") {
      this.innerHTML = "<p>No autorizado</p>";
      return;
    }

    this.storeId = this.user.storeId;
    this.loadProducts();
    this.render();
  }

  async loadProducts() {
    const res = await fetch(`/store/${this.storeId}/products`);
    const data = await res.json();
    const products = data.products;
    const container = this.shadowRoot.querySelector("#products-container");
    if(!container) {
      return
    }
    container.innerHTML = "";
    const response = await fetch(`/store/${this.storeId}`);
    const storeData = await response.json();
    const storeName = storeData.name;
    const banner = this.shadowRoot.querySelector(".dashboard-banner");
    banner.textContent = storeName;
      products.forEach(product => {
        const card = document.createElement("product-card");
        card.setAttribute('storeId', this.storeId);
        card.data = product;  
        container.appendChild(card);
      });
  }

  render() {
    if (!this.shadowRoot) {
      return;
    }
    
    if(this.user) {
        this.shadowRoot.innerHTML = 
    `
    <style>
    :host {
    --primary: #ff7d47;     /* bright orange */
    --secondary: #3c66f1ff;   /* teal green */
    --accent: #ffeaa7;      /* soft yellow */
    --background: #f9f9f9;  /* light gray background */
    --text: #2d3436;        /* dark text */
    --card-bg: #ffffff;     /* card white */
    --radius: 12px;
    --shadow: 0 4px 8px rgba(0,0,0,0.08);
    --font: "Poppins", "Inter", sans-serif;
    margin: 0;
    font-family: var(--font);
    background: var(--background);
    color: var(--text);
    line-height: 1.6;
  }
    h1, h2, h3 {
  color: var(--primary);
  margin-bottom: 0.5rem;
}

button {
    font-family: var(--font);

  background: var(--primary);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  box-shadow: var(--shadow);
}

button:hover {
    font-family: var(--font);

  background: var(--secondary);
  transform: translateY(-2px);
}
    #content {
  padding: 2rem;
}

#content h1 {
  margin-bottom: 1.5rem;
}

#add-product, #edit-store {
  margin-right: 1rem;
}

#products-container {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}
  .dashboard-banner {
    width: 100%;
    height: 120px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: var(--font);
    font-size: 2rem;
    font-weight: bold;
    border-radius: 0 0 var(--radius) var(--radius);
    box-shadow: var(--shadow);
  }
</style>

    </style>
    <div id="content">
    <div class="dashboard-banner">

    </div>
      <h1>Welcome to LENTI, ${this.user.username}!</h1>
      <button id="add-product">➕ Add Product</button>
      <button id="edit-store">⚙️ Edit Store</button>
      <div id="products-container">
      </div>
    </div>
    `;
    const content = this.shadowRoot.querySelector("#content");
    const addBtn = this.shadowRoot.getElementById('add-product');
    const editBtn = this.shadowRoot.getElementById('edit-store');

    addBtn.addEventListener('click', () => {
      const addPage = document.createElement("add-product-page");
      addPage.setAttribute('storeId', this.storeId);
      content.innerHTML = ""
      content.appendChild(addPage);
    })
    
    editBtn.addEventListener('click', () => {
      const editPage = document.createElement("edit-store");
      content.innerHTML = ""
      editPage.setAttribute('storeId', this.storeId);
      content.appendChild(editPage)
      
    })

    }
  }
}

customElements.define("dash-board", Dashboard);
