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
    const resp = await fetch(`/store/${product.storeId}`)
    const sdata = await resp.json();
    const storeName = sdata.name;
    this.render(product, storeName)
    } catch(error) {
    console.error(error);

    }

  }

  render(product, name) {
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
    color: var(--text);
    line-height: 1.6;
  }
    h1, h2, h3 {
  color: var(--primary);
  margin-bottom: 0.5rem;
}
  #item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.product {
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1rem;
  text-align: left;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  max-width: 250px;
  margin: 0 auto;
}

.product:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.product h1 {
  font-size: 1rem;
  margin-bottom: 0.4rem;
  color: var(--primary);
}


.product p {
  font-size: 0.85rem;
  color: var(--text-light);
  margin: 0.3rem 0;
}

/* Remove button - smaller, not full width */
#remove-cart {
  background: #e63946; /* red */
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius);
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s ease-in-out;
  margin-top: 0.6rem;
}

#remove-cart:hover {
  background: #d62828;
  transform: translateY(-2px);
}

    </style>
    <div class="product">
        <h1>${product.name}</h1>
        <p>${name}</p>
        <p>$${product.price}</p>
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
          window.location.reload();

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
