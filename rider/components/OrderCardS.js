class OrderCardS extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set data(order) {
    const user = JSON.parse(localStorage.getItem("user"));
    this.userId = user.userId;
    this.name = user.username;
    this.order = order;
    this.render();
  }

  render() {
    if (!this.shadowRoot || !this.order) return;

    const products = this.order.products || []; // safe fallback

    this.shadowRoot.innerHTML = `
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
  .order-card {
    background: var(--card-bg, #fff);
    border-radius: 12px;
    box-shadow: var(--shadow, 0 4px 8px rgba(0,0,0,0.08));
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .order-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  }

  .order-card h2 {
    color: var(--primary, #ff7d47);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .order-card h2::before {
    content: "🚴"; /* rider emoji */
    font-size: 1.4rem;
  }

  .order-card p {
    margin: 0.3rem 0;
    color: var(--text, #2d3436);
  }

  .products {
    margin-top: 1rem;
    padding-left: 1rem;
    border-left: 3px solid var(--secondary, #3c66f1);
  }

  .product {
    margin-bottom: 0.4rem;
    font-size: 0.95rem;
  }

  #delivered-btn {
    margin-top: 1rem;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 8px;
    background-color: var(--primary, #ff7d47);
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    box-shadow: var(--shadow, 0 4px 8px rgba(0,0,0,0.08));
  }

  #delivered-btn:hover {
    background: var(--secondary, #3c66f1);
    transform: translateY(-2px);
  }
      </style>

      <div class="order-card">
        <h2>Order #${this.order.orderId}</h2>
        <p><strong>Address:</strong> ${this.order.address || "N/A"}</p>
        <p><strong>Payment:</strong> ${this.order["payment-met"] || "N/A"}</p>
        <p><strong>Total:</strong> $${this.order.total || 0}</p>
        <div class="products">
          <h3>Products:</h3>
          ${
            products.length > 0
              ? products.map(p => `
                  <div class="product">
                    <p>${p.name} - $${p.price}</p>
                  </div>
                `).join("")
              : "<p>No products</p>"
          }
        </div>
        <button id="delivered-btn">Mark as Delivered</button>
      </div>
    `;
    const deliveredBtn = this.shadowRoot.getElementById("delivered-btn");
    deliveredBtn.addEventListener("click", () => {
      this.markAsDelivered();
    });
  }

  async markAsDelivered() {
    const res = await fetch(`/orders/${this.order.orderId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (res.ok) {
      this.shadowRoot.innerHTML = "<p>Order delivered!</p>";
    } else {
      this.shadowRoot.innerHTML = "<p>Error marking order as delivered.</p>";
    }
  }
}

customElements.define("order-card-s", OrderCardS);
