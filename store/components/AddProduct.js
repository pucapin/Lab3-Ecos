class AddProductPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const storeId = this.getAttribute('storeId');
    
    this.shadowRoot.innerHTML = `
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

button {
    font-family: var(--font);

  background: var(--primary);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  box-shadow: var(--shadow);
}

button:hover {
    font-family: var(--font);

  background: var(--secondary);
  transform: translateY(-2px);
}
    #productForm {
  max-width: 400px;
  margin: 2rem auto;
  padding: 4rem;
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

#productForm label {
  display: block;
  margin: 1rem 0;
}

#productForm input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: var(--radius);
}

    </style>
      <button id="back-btn">Back</button>

      <h2>Add Product</h2>
      <form id="productForm">
        <label>Name: <input name="name" required /></label><br/>
        <label>Price: <input type="number" name="price" required /></label><br/>
        <label>Description: <input name="description" /></label><br/>
        <label>Image: <input type="file" name="image" accept="image/*" /></label><br/>
        <button type="submit">Save</button>
      </form>
    `;
    const form = this.shadowRoot.querySelector("#productForm");
    this.shadowRoot.querySelector("#back-btn").addEventListener("click", () => {
          window.location.href = `/store`;
        });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const response = await fetch(`/store/${storeId}/products`);
      const existingProducts = await response.json();
      const productsArray = existingProducts.products;
      const maxProdId = productsArray.length > 0
        ? Math.max(...productsArray.map(p => p.prodId))
        : -1;

      const prodId = maxProdId + 1;



      const formData = new FormData(form);
      formData.append("prodId", prodId);
      formData.append("storeId", storeId);

        const res = await fetch(`/store/${storeId}/products`, {
            method: "POST",
            body: formData
        })

      const data = await res.json();
      console.log("Saved:", data);
      window.location.href = `/store`;
    });
  }
}

customElements.define("add-product-page", AddProductPage);
