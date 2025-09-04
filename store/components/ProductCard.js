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
  .product {
  background: var(--card-bg);
  padding: 1rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  text-align: center;
}

.product img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: var(--radius);
  margin-bottom: 1rem;
}

.product h1 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.product p {
  margin: 0.3rem 0;
}

#remove-btn {
  background: #d63031; /* red */
  margin-bottom: 0.5rem;
}

#remove-btn:hover {
  background: #ff7675;
}

</style>
    <div class="product">
    <button id="remove-btn">Remove</button>
        <h1>${product.name}</h1>
        <img src="${product.img}" alt="${product.name}" />
        <p>${product.description}</p>
        <p>$${product.price}</p>
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
