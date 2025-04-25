// YUWANANTA VALENCIA AFSHANDY
// FC-18

class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._apiUrl = "https://notes-api.dicoding.dev/v2/notes";
  }

  connectedCallback() {
    this.render();

    this._form = this.shadowRoot.querySelector("#noteForm");
    this._titleInput = this.shadowRoot.querySelector("#title");
    this._bodyInput = this.shadowRoot.querySelector("#body");
    this._submitButton = this.shadowRoot.querySelector("button[type='submit']");

    this._form.addEventListener("submit", this.handleSubmit.bind(this));
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
          max-width: 500px;
          margin: 2rem auto;
        }

        input, textarea {
          width: 100%; 
          box-sizing: border-box; 
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

        button:hover:not(:disabled) { 
          background: #357abd;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
        }

  
        button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
            opacity: 0.7;
        }
      </style>

      <form id="noteForm">
        <input type="text" id="title" placeholder="Judul Catatan" required />
        <textarea id="body" placeholder="Tulis isi catatan di sini..." rows="4" required></textarea>
        <button type="submit">Simpan Catatan</button>
      </form>
    `;
  }

  async handleSubmit(event) {
    event.preventDefault();

    const title = this._titleInput.value;
    const body = this._bodyInput.value;
    const noteListElement = document.querySelector("note-list");
    const noteModalElement = document.querySelector("note-modal");

    if (!title || !body) {
      if (noteModalElement) {
        noteModalElement.showModal("Judul dan isi catatan tidak boleh kosong.");
      }
      return;
    }

    this._submitButton.disabled = true;
    this._submitButton.textContent = "Menyimpan...";

    try {
      const response = await fetch(this._apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      });

      const result = await response.json();

      if (result.status !== "success") {
        throw new Error(result.message || "Gagal menambahkan catatan.");
      }

      this._form.reset();
      if (noteListElement) {
        noteListElement.refreshNotes();
      }

      setTimeout(() => {
        if (noteModalElement) {
          noteModalElement.showModal("Catatan berhasil ditambahkan!");
        }
      }, 500);
    } catch (error) {
      console.error("Error saat menambahkan catatan:", error);

      setTimeout(() => {
        if (noteModalElement) {
          noteModalElement.showModal(
            `Gagal menambahkan catatan: ${error.message}`,
          );
        }
      }, 500);
    } finally {
      this._submitButton.disabled = false;
      this._submitButton.textContent = "Simpan Catatan";
    }
  }
}

customElements.define("note-form", NoteForm);
