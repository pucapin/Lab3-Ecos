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
    this.cartnum = 0;
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
    const total = this.shadowRoot.getElementById('cart-total')
    if(!total) {
      return
    }
    total.innerHTML = "";
    container.innerHTML = "";
    if(cart.length === 0) {
      container.innerHTML = `<p>You dont have any items in your cart yet!</p>`
      total.textContent = "Total: 0"
      return
    }
      for (let i = 0; i < cart.length; i++ ) {
      this.cartnum += cart[i].price;
    }
    total.textContent = "Total: " + this.cartnum
    this.updateButton();

    cart.forEach(item => {
        const card = document.createElement("cart-card");
        const id = item.prodId
        card.setAttribute('prodId', id);
        card.setAttribute('userId', this.userId)
        container.appendChild(card);

    });
  }

  updateButton() {
    const createOrder = this.shadowRoot.getElementById('create-order');
    createOrder.disabled = this.cartnum === 0;
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
    <div class="cart-pay">
    <h2 id="cart-total">Total: </h2>
    <button id="create-order"> Create Order</button>
    </div>
    `;
    const createOrder = this.shadowRoot.getElementById('create-order');
    createOrder.disabled = this.cartnum === 0;

    createOrder.addEventListener('click', () => {
      window.location.href = `/client/checkout.html`;
    })
    
    }
  }
}

customElements.define("cart-page", CartPage);
