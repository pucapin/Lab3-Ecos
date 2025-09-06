class ActiveOrders extends HTMLElement {
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

    this.riderId = this.user.userId;
    this.render();
    this.loadOrders();

  }

  async loadOrders() {
    const response = await fetch(`/orders/rider/${this.riderId}`);
    const riderOrders = await response.json();
    console.log(riderOrders)


    const container = this.shadowRoot.querySelector("#orders-container");
    if(!container) {
      return
    }
    container.innerHTML = "";

    if(riderOrders.orders.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No active orders";
        container.appendChild(message);
    }
      riderOrders.orders.forEach(order => {
        const card = document.createElement("order-card-s");
        card.data = order;
        container.appendChild(card);
      });
  }
  render() {
    if (!this.shadowRoot) {
      return;
    }
    
    if(this.user) {
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
    font-family: var(--font, sans-serif);
  }

  #go-back {
    background: var(--secondary, #3c66f1);
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    margin-bottom: 1.5rem;
  }

  #go-back:hover {
    background: var(--primary, #ff7d47);
    transform: translateY(-2px);
  }
      </style>
    <div id="content">
    <button id="go-back">Go back</button>

      <h1>Your active orders</h1>
      <div id="orders-container">
      </div>
    </div>
    `;


    const myOrders = this.shadowRoot.getElementById('go-back');
    myOrders.addEventListener('click', () => {
        window.location.href = `/rider/index.html`;
    })
    }
  }
}

customElements.define("active-orders", ActiveOrders);
