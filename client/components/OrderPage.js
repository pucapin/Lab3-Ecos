class OrderPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.user = JSON.parse(localStorage.getItem("user"));
    if (!this.user || this.user.role !== "client") {
      this.shadowRoot.innerHTML = "<p>No autorizado</p>";
      return;
    }

    this.userId = this.user.userId;
    this.loadOrders();
  }

  async loadOrders() {
    const res = await fetch(`/orders/${this.userId}`);
    if (!res.ok) {
      console.error("Error fetching orders");
      return;
    }
    const data = await res.json();
    console.log(data);

    this.orders = data.orders || [];
    this.render();
  }

  render() {
  if (!this.shadowRoot) return;

  // Render everything, including the Go Back button
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
#content {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  font-family: var(--font);
}

#content h1 {
  text-align: center;
  color: var(--primary);
  margin-bottom: 2rem;
}

.order {
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.order:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.order h2 {
  color: var(--secondary);
  margin-bottom: 1rem;
}

.order h3 {
  margin-top: 1.2rem;
  color: var(--primary);
}

.items {
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 3px solid var(--accent);
}

.item {
  margin-bottom: 0.8rem;
}

.item p {
  margin: 0.2rem 0;
  font-size: 0.95rem;
}

/* Go back button */
#go-back {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  box-shadow: var(--shadow);
  margin: 1rem;
}

#go-back:hover {
  background: var(--secondary);
  transform: translateY(-2px);
}

    </style>
    <div id="content">
        <button id="go-back">Go back</button>
      <h1>Your Orders</h1>
      ${this.orders.length > 0 ? this.orders.map(order => `
        <div class="order">
          <h2>Total: ${order.total}</h2>
          <div class="items">
            ${order.products.map(product => `
              <div class="item">
                <p>Product name: ${product.name}</p>
                <p>Price: ${product.price}</p>
              </div>
            `).join('')}
          </div>
          <h3>Order details</h3>
          <p>Address: ${order.address}</p>
          <p>Payment Method: ${order['payment-met']}</p>
          <h2>Assigned rider: ${order.rider || "No assigned rider yet"}</h2>
        </div>
      `).join('') : "<p>No orders found.</p>"}
    </div>
  `;

  // Attach the event listener AFTER the button is in the DOM
  const goBack = this.shadowRoot.getElementById('go-back');
  if (goBack) {
    goBack.addEventListener('click', () => {
      window.location.href = `/client`;
    });
  }
  }
}

customElements.define("order-page", OrderPage);
