class StorePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

connectedCallback() {
  this.user = JSON.parse(localStorage.getItem("user"));
  this.userId = this.user.userId
  if (!this.user) {
    this.innerHTML = "<p>No autorizado</p>";
    return;
  }
  const params = new URLSearchParams(window.location.search);
  this.storeId = params.get("storeId"); 

    this.LoadStore()

  }

async LoadStore() {
    const res = await fetch(`/store/${this.storeId}`);
    const store = await res.json();
    this.render(store);
    this.loadProducts();
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

  render(store) {
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
    color: var(--text);
    line-height: 1.6;
  }
    #content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: var(--font);
}

#content h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
  text-align: left;
}

#content p {
  text-align: left;
  max-width: 700px;
  color: var(--text);
  font-size: 1.1rem;
  line-height: 1.5;
}

/* Buttons */
#content button {
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
  margin-right: 0.5rem;
}

#content button:hover {
  background: var(--secondary);
      font-family: var(--font);

  transform: translateY(-2px);
}

/* Products grid */
#products-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

/* Product card */
.product {
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.product:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.product img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

.product-content {
  padding: 1rem;
  flex-grow: 1;
}

.product h2 {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  color: var(--primary);
}

.product p {
  margin: 0.3rem 0;
  font-size: 0.95rem;
}

/* Price + action */
.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  background: #fafafa;
  border-top: 1px solid #eee;
}

.product-footer span {
  font-weight: 700;
  color: var(--secondary);
}

.product-footer button {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
}

    </style>
    <div id="content">
    <button id="go-back">Go back</button>
    <button id="cart-btn">Cart</button>
      <h1>Welcome to ${store.name}</h1>
      <p>${store.desc}</p>
      <div id="products-container">
      </div>
    </div>
    `;
    const cartBtn = this.shadowRoot.getElementById('cart-btn');
    cartBtn.addEventListener('click', () => {
        window.location.href = `/client/cart.html`;
    })
    const goBack = this.shadowRoot.getElementById('go-back');
    goBack.addEventListener('click', () => {
        window.location.href = `/client`
    })
    }
  }
}

customElements.define("store-page", StorePage);
