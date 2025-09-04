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
    .product {
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  text-align: center;
}

.product:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.product h1 {
  font-size: 1.3rem;
  color: var(--primary);
  margin: 0.5rem 0;
}

.product img {
  width: 400px;
  height: 180px;
  object-fit: cover;
  border-radius: var(--radius);
  margin: 0.5rem 0 1rem;
}

.product p {
  margin: 0.3rem 0;
  font-size: 1rem;
  color: var(--text);
}

.product p:last-of-type {
  font-weight: bold;
  color: var(--secondary);
  font-size: 1.1rem;
}

/* Add to cart button */
#add-cart {
    font-family: var(--font);

  margin-top: 1rem;
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

#add-cart:hover {
    font-family: var(--font);

  background: var(--secondary);
  transform: translateY(-2px);
}

    </style>
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
