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
