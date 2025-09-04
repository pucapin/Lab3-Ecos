class RiderOrder extends HTMLElement {
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

    const isAssigned = this.order.riderId && this.order.riderId !== "";
    const btnDisabled = isAssigned;

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
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
}

.order-card h2 {
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.order-card p {
  margin: 0.3rem 0;
  color: var(--text);
}

.products {
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 3px solid var(--secondary);
}

.product {
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
}

#accept-btn {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: var(--radius);
  background-color: var(--primary);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  box-shadow: var(--shadow);
}

#accept-btn:hover:not(:disabled) {
  background: var(--secondary);
  transform: translateY(-2px);
}

#accept-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}
      </style>

      <div class="order-card">
        <h2>Order #${this.order.orderId}</h2>
        <p><strong>Address:</strong> ${this.order.address}</p>
        <p><strong>Payment:</strong> ${this.order['payment-met']}</p>
        <p><strong>Total:</strong> $${this.order.total}</p>
        <div class="products">
          <h3>Products:</h3>
          ${this.order.products.map(p => `
            <div class="product">
              <p>${p.name} - $${p.price}</p>
            </div>
          `).join('')}
        </div>
        <p><strong>Assigned rider:</strong> ${isAssigned ? this.order.rider : "None"}</p>
        <button id="accept-btn">${isAssigned ? "Accepted" : "Accept Order"}</button>
      </div>
    `;

    const btn = this.shadowRoot.getElementById("accept-btn");
    btn.disabled = btnDisabled;

    if (!btn.disabled) {
      btn.addEventListener("click", () => this.acceptOrder());
    }
  }

  async acceptOrder() {
    try {
      const res = await fetch(`/orders/${this.order.orderId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rider: this.name,
          riderId: this.userId
        })
      });

      if (!res.ok) throw new Error("Failed to accept order");

      this.order.rider = this.name;
      this.order.riderId = this.userId;
      this.render();
    } catch (err) {
      console.error(err);
      alert("Could not accept order");
    }
  }
}

customElements.define("order-card", RiderOrder);
