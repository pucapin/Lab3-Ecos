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
    <div class="store" id="store-card">
        <h1>${store.name}</h1>
        <img></img>
        <p>${store.address}</p>
        <p>${store.state ? "Open" : "Closed"}</p>
    </div>
    `;
    const storeCard = this.shadowRoot.getElementById('store-card');
    storeCard.addEventListener('click', () => {
         window.location.href = `/client/store.html?storeId=${store.storeId}`;
    })
  }
}

customElements.define("store-card", StoreCard);
