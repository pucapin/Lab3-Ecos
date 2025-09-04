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
    <style>
:host {
  --primary: #ff7d47;
  --secondary: #3c66f1ff;
  --accent: #ffeaa7;
  --background: #f9f9f9;
  --text: #2d3436;
  --card-bg: #ffffff;
  --radius: 12px;
  --shadow: 0 4px 8px rgba(0,0,0,0.08);
  --font: "Poppins", "Inter", sans-serif;

  margin: 0;
  font-family: var(--font);
  color: var(--text);
  line-height: 1.6;
  display: block;
}

h2 {
  text-align: center;
  color: var(--primary);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.left {
display: flex;
flex-direction: row;
align-items: center;
justify-content: left;
}
#state-btn {
  display: block;
  margin: 0 auto 2rem auto;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  background: var(--secondary);
  color: white;
  font-weight: 700;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: 0.2s ease-in-out;
  box-shadow: var(--shadow);
}

#state-btn:hover {
  background: var(--primary);
  transform: translateY(-2px);
}
  #back-btn {
    font-family: var(--font);

  background: var(--primary);
  color: white;
  margin-right: 1rem;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  box-shadow: var(--shadow);
}

#back-btn:hover {
    font-family: var(--font);

  background: var(--secondary);
  transform: translateY(-2px);
}


#save-btn {
  display: block;
  margin: 0 auto 2rem auto;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  background: var(--secondary);
  color: white;
  font-weight: 700;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: 0.2s ease-in-out;
  box-shadow: var(--shadow);
}

#save-btn:hover {
  background: var(--primary);
  transform: translateY(-2px);
}

#editStoreForm {
  max-width: 450px;
  margin: 0 auto 3rem auto;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

#editStoreForm label {
  display: block;
  margin: 1.2rem 0 0.5rem 0;
  font-weight: 600;
}

#editStoreForm input,
#editStoreForm textarea {
  width: 100%;
  padding: 0.8rem;
  border-radius: var(--radius);
  border: 1px solid #ccc;
  font-family: var(--font);
  font-size: 1rem;
}

#editStoreForm textarea {
  resize: vertical;
  min-height: 100px;
}

#editStoreForm button[type="submit"] {
  margin-top: 1.5rem;
  width: 100%;
}

  </style>
  <div class="left">
      <button id="back-btn">Back</button>
      <h2>Edit Store</h2>
  </div>
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
          <textarea id="desc" name="description" rows="4" required></textarea>
        </label>
        <br/>
        <button type="submit" id="save-btn">Save</button>
      </form>
    `;

    this.shadowRoot.querySelector("#name").value = store.name || "";
    this.shadowRoot.querySelector("#address").value = store.address || "";
    this.shadowRoot.querySelector("#desc").value = store.desc || "";
    this.shadowRoot.querySelector("#back-btn").addEventListener("click", () => {
      window.location.href = `/store`;
    });

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
