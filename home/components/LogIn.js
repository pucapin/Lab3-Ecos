
class LogIn extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) {
      return;
    }
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
  background: var(--secondary);
  transform: translateY(-2px);
}
.log-in {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  text-align: center;
}

.log-in h1 {
  margin-bottom: 1.5rem;
}

.log-in label {
  display: block;
  margin: 1rem 0;
  text-align: left;
}

.log-in input {
  width: 100%;
  padding: 0.6rem;
  border-radius: var(--radius);
  border: 1px solid #ccc;
  margin-top: 0.3rem;
}
  .cool-title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  color: var(--primary);
  letter-spacing: 1px;
  margin: 2rem 0;
  text-shadow: 2px 4px 8px rgba(0,0,0,0.1);
  background: var(--primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


    </style>


    <h1 class="cool-title">Welcome to LENTI !</h1>

    <div class="log-in">
    <h1>Log in</h1>
    <form id="logInForm">
      <label>
        Username:
        <input type="text" name="username" id="input-user" />
      </label>
      <label>
        Password
        <input type="password" name="pass" id="input-pass" />
      </label>
      <br/>
      <button type="submit">Enviar</button>
    </form>
    </div>
            `;
    const logForm = this.shadowRoot.getElementById('logInForm');
    logForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = this.shadowRoot.getElementById("input-user").value;
      const password = this.shadowRoot.getElementById("input-pass").value;

      fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
        .then(res => {
          if (!res.ok) throw new Error("Login failed");
          return res.json();
        })
        .then(data => {
          console.log("Login success:", data);
          if (data.role === "client") {
            window.location.href = "/client";
            localStorage.setItem("user", JSON.stringify(data));
          } else if (data.role === "store") {
            window.location.href = "/store";
            localStorage.setItem("user", JSON.stringify(data));

          } else if (data.role === "rider") {
            window.location.href = "/rider";
            localStorage.setItem("user", JSON.stringify(data));
          }

        })
        .catch(err => {
          console.error(err);
        });
    });
  }
}

customElements.define("login-page", LogIn);
