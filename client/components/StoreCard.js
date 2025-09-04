class StoreCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set data(store) {
    this.render(store);
  }

  render(store) {
    if (!this.shadowRoot) {
      return;
    }
    
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
    color: var(--text);
    line-height: 1.6;
  }
    h1, h2, h3 {
  color: var(--primary);
  margin-bottom: 0.5rem;
}
  <style>
  #stores-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 2rem;
  }

  .store {
    background: var(--card-bg);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 1.5rem;
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    width: 300px;
  }

  .store img {
    width: 100%;
    max-height: 150px;
    object-fit: cover;
    border-radius: var(--radius);
    margin-bottom: 1rem;
  }

  .store:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.12);
  }

  .store h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: var(--primary);
  }

  .store p {
    margin: 0.3rem 0;
  }
    .store-status.open {
  color: var(--secondary);
}

.store-status.closed {
  color: #d63031; /* red */
}
</style>

    <div class="store" id="store-card">
        <h1>${store.name}</h1>
        <img></img>
        <p>${store.address}</p>
        <p>${store.state ? "Open" : "Closed"}</p>
    </div>
    `;
    const storeCard = this.shadowRoot.getElementById('store-card');
    storeCard.addEventListener('click', () => {
      if (store.state === true) {
        window.location.href = `/client/store.html?storeId=${store.storeId}`;
      } else {
        alert("This store is currently closed");
      }
    })
    }
  }


customElements.define("store-card", StoreCard);
