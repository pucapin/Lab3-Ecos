class EditStore extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.loadStoreData();
  }

  async loadStoreData() {
    const storeId = this.getAttribute("store-id");
    const res = await fetch(`/store/${storeId}`);
    const store = await res.json();

    this.shadowRoot.querySelector("#name").value = store.name || "";
    this.shadowRoot.querySelector("#address").value = store.address || "";
  }

  render() {
    this.shadowRoot.innerHTML = `
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
        <button type="submit">Save</button>
      </form>
      <button>Open Store</button>
    `;

    this.shadowRoot.querySelector("#editStoreForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const storeId = this.getAttribute("store-id");
      const formData = new FormData(e.target);
      const updatedStore = Object.fromEntries(formData.entries());

      const res = await fetch(`/store/${storeId}`, {
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
