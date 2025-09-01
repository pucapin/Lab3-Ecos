class CartCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.userId = this.getAttribute('userId')
    this.loadItem();
  }

  async loadItem() {
    const prodId = this.getAttribute('prodId');
    try {
    const res = await fetch(`/products/${prodId}`);
    const data = await res.json();
    const product = data.product
    this.render(product)
    } catch(error) {
    console.error(error);

    }

  }

  render(product) {
    if (!this.shadowRoot) {
      return;
    }
    
    this.shadowRoot.innerHTML = 
    `
    <div class="product">
        <h1>${product.name}</h1>
        <img></img>
        <p>${product.description}</p>
        <p>${product.price}</p>
    <button id="remove-cart">Remove</button>
    </div>
    `;
    const removeBtn = this.shadowRoot.getElementById('remove-cart');
    removeBtn.addEventListener('click', async () => {
    try {
        const res = await fetch(`/users/${this.userId}/cart/${product.prodId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        })
        if(res.ok) {
          this.remove();
        } else {
        const errorMsg = await res.json();
        console.error("Failed to delete product", errorMsg);
        }
        } catch (error) {
        console.error(error);
    }
    }
)
  }
}

customElements.define("cart-card", CartCard);
