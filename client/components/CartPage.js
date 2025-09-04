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
      this.cartnum += parseInt(cart[i].price);
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

#back-btn {
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

#back-btn:hover {
  background: var(--secondary);
  transform: translateY(-2px);
}
  

#content h1 {
  text-align: center;
  color: var(--primary);
  margin-bottom: 2rem;
}

/* Cart button */
#cart-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  box-shadow: var(--shadow);
  margin-bottom: 1rem;
}

#cart-btn:hover {
  background: var(--secondary);
  transform: translateY(-2px);
}

/* Cart items */
#item-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cart-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.cart-item-info {
  flex: 1;
}

.cart-item-info h3 {
  margin: 0;
  color: var(--secondary);
}

.cart-item-info p {
  margin: 0.2rem 0;
  font-size: 0.9rem;
  color: var(--text-light);
}

/* Cart payment section */
.cart-pay {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#cart-total {
  font-size: 1.3rem;
  color: var(--primary);
}

/* Create order button */
#create-order {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.8rem 1.4rem;
  border-radius: var(--radius);
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  box-shadow: var(--shadow);
}

#create-order:hover {
  background: var(--secondary);
  transform: translateY(-2px);
}

    </style>
    <div id="content">
    <button id="back-btn">Go Back</button>
      <h1>${this.user.username}'s Cart</h1>
      <div id="item-container">
      </div>
        <div class="cart-pay">
    <h2 id="cart-total">Total: </h2>
    <button id="create-order"> Create Order</button>
    </div>
    </div>
    `;
    const goBack = this.shadowRoot.getElementById('back-btn');
    goBack.addEventListener('click', () => {
      window.history.back();
    });
    const createOrder = this.shadowRoot.getElementById('create-order');
    createOrder.disabled = this.cartnum === 0;

    createOrder.addEventListener('click', () => {
      window.location.href = `/client/checkout.html`;
    })
    
    }
  }
}

customElements.define("cart-page", CartPage);
