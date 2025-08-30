class LogStore extends HTMLElement {
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
    <h1>Log In</h1>
    <form id="logInForm">
        <label>
        Store Name:
        <input type="text" name="store" id="input-store" />
      </label>
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
    
  }
}

customElements.define("log-store", LogStore);
