// YUWANANTA VALENCIA AFSHANDY
// FC-18
class NoteModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.showModal("Selamat datang di aplikasi catatan!");
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .modal {
          display: none;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          text-align: center;
          width: 300px;
        }
        .modal button {
          margin-top: 10px;
          background-color: var(--primary, #007bff);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }
      </style>
      <div class="modal">
        <div class="modal-content">
          <p id="modalMessage"></p>
          <button id="closeModal">Tutup</button>
        </div>
      </div>
    `;

    this.shadowRoot
      .querySelector("#closeModal")
      .addEventListener("click", () => this.hideModal());
  }

  showModal(message = "Tidak ada pesan") {
    const messageElement = this.shadowRoot.querySelector("#modalMessage");
    if (messageElement) {
      messageElement.innerText = message;
    }
    this.shadowRoot.querySelector(".modal").style.display = "flex";
  }

  hideModal() {
    this.shadowRoot.querySelector(".modal").style.display = "none";
  }
}

customElements.define("note-modal", NoteModal);
