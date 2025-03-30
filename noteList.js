// YUWANANTA VALENCIA AFSHANDY
// FC-18
class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.notes = [];
  }

  connectedCallback() {
    this.render();
    this.fetchNotes();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .notes-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 20px; 
          padding: 1rem;
        }

        .empty-state { 
          color: #7f8c8d; 
          text-align: center; 
          font-size: 1.2rem;
          font-weight: 500;
          width: 100%;
          padding: 2rem;
        }
        
        .note {
          background: linear-gradient(135deg, #ffffff, #f8f9fa);
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease-in-out;
          position: relative;
          overflow: hidden;
        }
        
        .note:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          background: linear-gradient(135deg, #eef1f5, #ffffff);
        }

        .note::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
          background: #4a90e2;
          border-radius: 12px 0 0 12px;
        }

        h3 {
          margin: 0;
          font-size: 1.4rem;
          color: #34495e;
          font-weight: 600;
        }

        p {
          margin-top: 0.75rem;
          font-size: 1rem;
          color: #555;
          line-height: 1.5;
        }

        .date {
          font-size: 0.9rem;
          color: #7f8c8d;
          margin-top: 1rem;
          display: block;
          text-align: right;
          font-style: italic;
        }

        /* Tombol Hapus */
        .delete-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          background: red;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s ease-in-out, transform 0.2s;
        }

        .delete-btn svg {
          width: 18px;
          height: 18px;
          fill: white;
        }

        .delete-btn:hover {
          transform: scale(1.1);
          background: darkred;
        }

        .note:hover .delete-btn {
          opacity: 1;
        }
      </style>
      
      <div id="notesContainer" class="notes-grid">
        <div class='empty-state'>Belum ada catatan. Yuk buat yang pertama!</div>
      </div>
    `;
  }

  addNote(note) {
    this.notes.unshift(note);
    this.updateNotes();
  }

  updateNotes() {
    const container = this.shadowRoot.querySelector("#notesContainer");
    container.innerHTML = "";

    if (this.notes.length === 0) {
      container.innerHTML =
        "<div class='empty-state'>Belum ada catatan. Yuk buat yang pertama!</div>";
      return;
    }

    this.notes.forEach((note, index) => {
      const noteElement = document.createElement("div");
      noteElement.classList.add("note");
      noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.body}</p>
            <button class="delete-btn" data-index="${index}">
                🗑️
            </button>
        `;

      //  hapus catatan
      noteElement.querySelector(".delete-btn").addEventListener("click", () => {
        this.notes.splice(index, 1);
        this.updateNotes();
        document
          .querySelector("note-modal")
          .showModal("Catatan berhasil dihapus!");
      });

      container.appendChild(noteElement);
    });
  }

  async fetchNotes() {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/dicodingacademy/a163-bfwd-labs/099-shared-files/notes.js"
      );

      if (!response.ok) {
        throw new Error("Gagal memuat data dari server.");
      }

      const scriptText = await response.text();
      this.notes = new Function(scriptText + "; return notesData;")();
      this.updateNotes();
    } catch (error) {
      console.error("Error saat memuat catatan:", error);
      this.notes = [
        { title: "Contoh Catatan 1", body: "Ini adalah catatan pertama." },
        { title: "Contoh Catatan 2", body: "Ini adalah catatan kedua." },
      ];
      this.updateNotes();
    }
  }
}

customElements.define("note-list", NoteList);
