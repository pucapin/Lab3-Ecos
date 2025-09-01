class CartPage extends HTMLElement {
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
    this.loadUser();
    this.render();
  }

  async loadUser() {
    const res = await fetch(`/users/${this.userId}`);
    const data = await res.json();
    const user = data.user;
    const cart = user.cart;
    const container = this.shadowRoot.querySelector("#item-container");
    if(!container) {
      return
    }
    container.innerHTML = "";
    if(cart.length === 0) {
      container.innerHTML = `<p>You dont have any items in your cart yet!</p>`
    }
    cart.forEach(item => {
        const card = document.createElement("cart-card");
        const id = item.prodId
        card.setAttribute('prodId', id);
        card.setAttribute('userId', this.userId)
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
      <h1>${this.user.username}'s Cart</h1>
      <div id="item-container">
      </div>
    </div>
    `;

    }
  }
}

customElements.define("cart-page", CartPage);
