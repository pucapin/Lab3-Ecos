class CheckPage extends HTMLElement {
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
      this.sum += parseInt(this.cart[i].price);
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
  text-align: center;
  margin: 2rem 0;
}

#content h1 {
  font-size: 2rem;
  color: var(--primary);
}

.cart-pay {
  text-align: center;
  margin-bottom: 1.5rem;
}

#cart-total {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--secondary);
}

#checkout-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

#checkout-form label {
  font-weight: 600;
  display: flex;
  flex-direction: column;
  color: var(--text);
}

#checkout-form input,
#checkout-form select {
  margin-top: 0.4rem;
  padding: 0.6rem;
  border-radius: var(--radius);
  border: 1px solid #ccc;
  font-size: 1rem;
}

#check-out {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  box-shadow: var(--shadow);
  margin-top: 0.5rem;
}

#check-out:hover {
  background: var(--secondary);
  transform: translateY(-2px);
}

    </style>
    <div id="content">
      <h1>Checkout</h1>
    </div>
    <div class="cart-pay">
    <h2 id="cart-total">Total: </h2>
    </div>
    <form id="checkout-form">
        <label>
          Address:
          <input type="text" id="address" name="address" required />
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
      const response = await fetch("/orders");
      const d = await response.json();
      const orders = d.orders
      let orderNum = 0;
      if(orders.length === 0) {
       orderNum =  0;
      } else {
      const lastOrder = orders[orders.length - 1]; 
      orderNum = lastOrder.orderId + 1; 
      }



      const order = {
        orderId: orderNum,
        userId: this.userId,
        rider: "No rider",
        riderId: "",
        total: this.sum,
        ...data,
        products: this.cart
      }
      const res = await fetch(`/orders`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(order)

      })
      if(res.ok) {
        const newOrder = await res.json();
        console.log("Created new order:", newOrder);
        window.location.href = `/client/order.html`;

      } else {
        console.log("Error creating new order")
      }
      

    })

    }
  }
}

customElements.define("check-page", CheckPage);
