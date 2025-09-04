class Dashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.user = JSON.parse(localStorage.getItem("user"));
    if (!this.user || this.user.role !== "rider") {
      this.innerHTML = "<p>No autorizado</p>";
      return;
    }

    this.userId = this.user.userId;
    this.render();
    this.loadOrders();

  }

  async loadOrders() {
    const res = await fetch(`/orders`);
    const data = await res.json();
    const orders = data.orders;
    const container = this.shadowRoot.querySelector("#orders-container");
    if(!container) {
      return
    }
    container.innerHTML = "";
    if(orders.length === 0) {
      const message = document.createElement("p");
      message.textContent = "There are no orders available";
      container.appendChild(message);
    } else {
      orders.forEach(order => {
        const card = document.createElement("order-card");
        card.data = order;
        container.appendChild(card);
      });
  }
  }

  render() {
    if (!this.shadowRoot) {
      return;
    }
    
    if(this.user) {
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
    #content {
  padding: 2rem;
  font-family: var(--font);
}

#my-orders {
  background: var(--secondary);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
}

#my-orders:hover {
  background: var(--primary);
  transform: translateY(-2px);
}

#orders-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

    </style>
    <div id="content">
    <button id="my-orders">Active Orders</button>

      <h1>Welcome to LENTI, ${this.user.username}!</h1>
      <div id="orders-container">
      </div>
    </div>
    `;


    const myOrders = this.shadowRoot.getElementById('my-orders');
    myOrders.addEventListener('click', () => {
        window.location.href = `/rider/orders.html`;
    })
    }
  }
}

customElements.define("dash-board", Dashboard);
