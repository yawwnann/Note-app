// YUWANANTA VALENCIA AFSHANDY
// FC-18
class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["title", "body"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .note {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .note:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        h3 {
          margin: 0;
          font-size: 1.4rem;
          color: #2d3436;
          font-weight: 600;
        }

        p {
          margin: 0.75rem 0 0;
          font-size: 1.1rem;
          color: #555;
          line-height: 1.5;
        }
      </style>
      <div class="note">
        <h3>${this.getAttribute("title") || "Tanpa Judul"}</h3>
        <p>${this.getAttribute("body") || "Tidak ada isi catatan."}</p>
      </div>
    `;
  }
}

customElements.define("note-item", NoteItem);
