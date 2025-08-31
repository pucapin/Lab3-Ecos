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
