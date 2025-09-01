class EditStore extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.loadStoreData();
  }

  async loadStoreData() {
    const storeId = this.getAttribute("storeId");
    const res = await fetch(`/store/${storeId}`);
    const store = await res.json();
    this.render(store);


  }

  render(store) {
    this.shadowRoot.innerHTML = `
      <h2 id="open-closed">Text</h2>
      <button id="state-btn">Open Store</button>
      <form id="editStoreForm">
        <label>
          Store Name:
          <input type="text" id="name" name="name" required />
        </label>
        <br/>
        <label>
          Address:
          <input type="text" id="address" name="address" required />
        </label>
        <br/>
        <label>
          Description:
          <input type="text" id="desc" name="description" required />
        </label>
        <br/>
        <button type="submit">Save</button>
      </form>
    `;

    this.shadowRoot.querySelector("#name").value = store.name || "";
    this.shadowRoot.querySelector("#address").value = store.address || "";
    this.shadowRoot.querySelector("#desc").value = store.desc || "";

    let state = store.state;
    const openClosed = this.shadowRoot.querySelector("#open-closed");
    function updateButton() {
    if(state === false) {
      openClosed.textContent = "Closed";
    } else {
      openClosed.textContent = "Open";
    }
    }
    updateButton();
    
    const stateBtn = this.shadowRoot.getElementById('state-btn');
    stateBtn.addEventListener('click', () => {
      state = !state;
      updateButton();
    })

    this.shadowRoot.querySelector("#editStoreForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = store.storeId
      console.log(id)
      const formData = new FormData(e.target);
      const updatedStore =  {
        ...Object.fromEntries(formData.entries()),
        state: state
      }

      const res = await fetch(`/store/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStore),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Store updated:", data);
        window.location.href = `/store`;
      } else {
        console.error("Failed to update store");
      }
    });

  }
}

customElements.define("edit-store", EditStore);
