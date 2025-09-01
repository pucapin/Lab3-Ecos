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
    <div id="content">
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
