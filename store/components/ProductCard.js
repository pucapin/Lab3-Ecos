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
    <button id="remove-btn">Remove</button>
    <button>Available</button>
        <h1>${product.name}</h1>
        <img></img>
        <p>${product.description}</p>
        <p>${product.price}</p>
    </div>
    `;
    const storeId = this.getAttribute('storeId')
    const removeBtn = this.shadowRoot.getElementById('remove-btn');
    removeBtn.addEventListener('click', async () => {
      try {
        const res = await fetch(`/store/${storeId}/products/${product.prodId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          console.log("Deleted:", data);
          this.remove();
          
        } else {
          const err = await res.text();
          console.error("Failed to delete product:", err);
        }
      } catch (err) {
        console.error("Error sending DELETE request:", err);
      }
    });
  }
}

customElements.define("product-card", ProductCard);
