class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set data(product) {
    this.render(product);
  }

  render(product) {
    if (!this.shadowRoot) {
      return;
    }
    
    this.shadowRoot.innerHTML = 
    `
    <div class="product">
    <button>Remove</button>
    <button>Available</button>
        <h1>${product.name}</h1>
        <img></img>
        <p>${product.description}</p>
        <p>${product.price}</p>
    </div>
    `;
  }
}

customElements.define("product-card", ProductCard);
