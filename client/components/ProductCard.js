class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set data(product) {
    const user = JSON.parse(localStorage.getItem("user"));
    this.userId = user.userId;
    this.render(product);
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
    <button id="add-cart">Add to cart</button>
    </div>
    `;
    const addCart = this.shadowRoot.getElementById('add-cart');
    addCart.addEventListener('click', async () => {
    try {
        const res = await fetch(`/users/${this.userId}/cart/${product.prodId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        })
        if(res.ok) {
        alert('Item added to cart!')
        } else {
          const errorMsg = await res.json();
          console.error("Failed to add product", errorMsg);
        }
    }catch (error) {
        console.error(error);
    }
    })
  }
}

customElements.define("product-card", ProductCard);
