class Dashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.user = JSON.parse(localStorage.getItem("user"));
    if (!this.user || this.user.role !== "client") {
      this.innerHTML = "<p>No autorizado</p>";
      return;
    }

    this.userId = this.user.userId;
    this.loadStores();
    this.render();
  }

  async loadStores() {
    const res = await fetch(`/stores`);
    const data = await res.json();
    const stores = data.stores;
    const container = this.shadowRoot.querySelector("#stores-container");
    if(!container) {
      return
    }
    container.innerHTML = "";
  
      stores.forEach(store => {
        const card = document.createElement("store-card");
        card.data = store;  
        console.log(store)
        container.appendChild(card);
      });
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
  <style>
  /* ===== Dashboard Layout ===== */
  #content {
    padding: 2rem;
    font-family: var(--font);
    background: var(--background);
    min-height: 100vh;
  }

  /* ===== Banner ===== */
  #dashboard-banner {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    padding: 2rem;
    border-radius: var(--radius);
    text-align: center;
    margin-bottom: 2rem;
    box-shadow: var(--shadow);
  }

  #dashboard-banner h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: white;
  }

  /* ===== Action Buttons (Cart, Orders) ===== */
  .dashboard-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
    font-family: var(--font);

  }

  .dashboard-actions button {
      font-family: var(--font);

    background: var(--primary);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: var(--radius);
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
    box-shadow: var(--shadow);
  }

  .dashboard-actions button:hover {
    background: var(--secondary);
    transform: translateY(-3px);
  }

  /* ===== Store Cards Grid ===== */
  #stores-container {
      margin: 100px;

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .store {
    background: var(--card-bg);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 1.5rem;
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
  }

  .store:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.12);
  }

  .store img {
    width: 100%;
    max-height: 150px;
    object-fit: cover;
    border-radius: var(--radius);
    margin-bottom: 1rem;
  }

  .store h1 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: var(--primary);
  }

  .store p {
    margin: 0.3rem 0;
    font-size: 0.95rem;
    color: var(--text);
  }
  </style>
    <div id="content">
  <div id="dashboard-banner">
    <h1>Welcome to LENTI, ${this.user.username}!</h1>
  </div>

  <div class="dashboard-actions">
    <button id="cart-btn">Cart</button>
    <button id="my-orders">My Orders</button>
  </div>

  <div id="stores-container">
  </div>
</div>

    `;
    const cartBtn = this.shadowRoot.getElementById('cart-btn');
    cartBtn.addEventListener('click', () => {
        window.location.href = `/client/cart.html`;
    })
    const myOrders = this.shadowRoot.getElementById('my-orders');
    myOrders.addEventListener('click', () => {
        window.location.href = `/client/order.html`;
    })
    }
  }
}

customElements.define("dash-board", Dashboard);
