class OrderPage extends HTMLElement {
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
    this.sum = 0;
    this.cart = [];
    this.loadUser();
    this.render();
  }

  async loadUser() {
    const res = await fetch(`/users/${this.userId}`);
    const data = await res.json();
    const user = data.user;
    this.cart = user.cart;
    const total = this.shadowRoot.getElementById('cart-total')
    if(!total) {
      return
    }
    total.innerHTML = "";
    if(this.cart.length === 0) {
      total.textContent = "Total: 0"
      return
    }
    for (let i = 0; i < this.cart.length; i++ ) {
      this.sum += this.cart[i].price;
    }
    total.textContent = "Total: " + this.sum
  }

  render() {
    if (!this.shadowRoot) {
      return;
    }
    
    if(this.user) {
        this.shadowRoot.innerHTML = 
    `
    <div id="content">
      <h1>Checkout</h1>
    </div>
    <div class="cart-pay">
    <h2 id="cart-total">Total: </h2>
    </div>
    <form id="checkout-form">
        <label>
          Store Name:
          <input type="text" id="name" name="address" required />
        </label>
        <br/>
        <select id="payment-met" name="payment-met">
            <option value="cash">Cash</option>
            <option value="card">Card</option>
        </select>
        <br/>
        <button id="check-out">Checkout</button>
    </form>

    `;

    const checkOut = this.shadowRoot.getElementById('checkout-form');
    checkOut.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      const order = {
        orderId: 0,
        userId: this.userId,
        riderId: "",
        total: this.sum,
        ...data,
        products: this.cart
      }
      const res = await fetch(`/orders`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(order)

      });
      if(resd.ok) {
        const resd = await res.json();
        console.log("Created new order:", resd);
        window.location.href = `/client/order.html`;
      } else {
        console.log("Error creating new order")
      }
      

    })

    }
  }
}

customElements.define("check-page", CheckPage);
