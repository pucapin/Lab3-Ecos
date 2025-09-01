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
    <div id="content">
    <button id="cart-btn">Cart</button>
      <h1>Welcome to LENTI, ${this.user.username}!</h1>
      <div id="stores-container">
      </div>
    </div>
    `;
    const cartBtn = this.shadowRoot.getElementById('cart-btn');
    cartBtn.addEventListener('click', () => {
        window.location.href = `/client/cart.html`;
    })

    }
  }
}

customElements.define("dash-board", Dashboard);
