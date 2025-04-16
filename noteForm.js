class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 45x0px;
          margin: 0 auto;
        }

        input, textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease-in-out;
          background: #f8f9fa;
        }

        input:focus, textarea:focus {
          border-color: #4a90e2;
          outline: none;
          box-shadow: 0 0 5px rgba(74, 144, 226, 0.3);
          background: white;
        }

        button {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 12px;
          font-size: 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        button:hover {
          background: #357abd;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
        }
      </style>
      
      <form id="noteForm">
        <input type="text" id="title" placeholder="Judul Catatan" required />
        <textarea id="body" placeholder="Tulis isi catatan di sini..." rows="4" required></textarea>
        <button type="submit">Simpan Catatan</button>
      </form>
    `;

    this.shadowRoot
      .querySelector("#noteForm")
      .addEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(e) {
    e.preventDefault();
    const title = this.shadowRoot.querySelector("#title").value;
    const body = this.shadowRoot.querySelector("#body").value;
    document.querySelector("note-list").addNote({ title, body });
    this.shadowRoot.querySelector("#noteForm").reset();
    document
      .querySelector("note-modal")
      .showModal("Catatan berhasil ditambahkan");
  }
}
customElements.define("note-form", NoteForm);
