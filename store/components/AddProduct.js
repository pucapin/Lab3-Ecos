class AddProductPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const storeId = this.getAttribute('storeId');
    
    this.shadowRoot.innerHTML = `
      <h2>Add Product</h2>
      <form id="productForm">
        <label>Name: <input name="name" required /></label><br/>
        <label>Price: <input type="number" name="price" required /></label><br/>
        <label>Description: <input name="description" /></label><br/>
        <label>Image URL: <input name="img" /></label><br/>
        <button type="submit">Save</button>
      </form>
    `;

    this.shadowRoot.querySelector("#productForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const product = Object.fromEntries(formData.entries());
      product.storeId = storeId;

        const res = await fetch(`/store/${storeId}/products`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(product)
        })

      const data = await res.json();
      console.log("Saved:", data);
      window.location.href = `/store`;
    });
  }
}

customElements.define("add-product-page", AddProductPage);
