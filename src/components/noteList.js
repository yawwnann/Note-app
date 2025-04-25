// YUWANANTA VALENCIA AFSHANDY
// FC-18

import { gsap } from "gsap";

class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._notes = [];
    this._apiBaseUrl = "https://notes-api.dicoding.dev/v2";
    this._showArchived = false;
  }

  connectedCallback() {
    this.render();
    this.fetchNotes();
  }

  refreshNotes() {
    this._showArchived = false;
    this.fetchNotes();
  }

  toggleArchivedView(showArchived) {
    if (
      typeof showArchived === "boolean" &&
      this._showArchived !== showArchived
    ) {
      this._showArchived = showArchived;
      this.fetchNotes();
    }
  }

  showLoading() {
    const loadingIndicator =
      this.shadowRoot.querySelector(".loading-indicator");
    const notesGrid = this.shadowRoot.querySelector(".notes-grid");
    if (loadingIndicator) {
      loadingIndicator.style.display = "block";
      if (notesGrid) notesGrid.style.visibility = "hidden";
    }
    const emptyState = this.shadowRoot.querySelector(".empty-state");
    const errorState = this.shadowRoot.querySelector(".error-state");
    if (emptyState) emptyState.style.display = "none";
    if (errorState) errorState.style.display = "none";
  }

  hideLoading() {
    const loadingIndicator =
      this.shadowRoot.querySelector(".loading-indicator");
    const notesGrid = this.shadowRoot.querySelector(".notes-grid");
    if (loadingIndicator) {
      loadingIndicator.style.display = "none";
      if (notesGrid) notesGrid.style.visibility = "visible";
    }
    const emptyState = this.shadowRoot.querySelector(".empty-state");
    const errorState = this.shadowRoot.querySelector(".error-state");
    if (emptyState) {
      emptyState.textContent = this._showArchived
        ? "Belum ada catatan yang diarsipkan."
        : "Belum ada catatan aktif. Yuk buat yang pertama!";
    }
    if (
      emptyState &&
      this._notes.length === 0 &&
      errorState.style.display === "none"
    ) {
      emptyState.style.display = "block";
    }
    if (errorState.style.display === "block" && emptyState) {
      emptyState.style.display = "none";
    }
  }

  render() {
    const initialEmptyText = this._showArchived
      ? "Belum ada catatan yang diarsipkan."
      : "Belum ada catatan aktif. Yuk buat yang pertama!";
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: 100%; position: relative; min-height: 150px; }
        .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; padding: 1rem; }
        .empty-state, .error-state { color: #7f8c8d; text-align: center; font-size: 1.2rem; font-weight: 500; width: 100%; padding: 2rem; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 5; }
        .error-state { color: red; }
        .note {
            background: linear-gradient(135deg, #ffffff, #f8f9fa);
            padding: 1.5rem; padding-bottom: 50px; border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Shadow sedikit lebih halus */
            transition: all 0.3s ease-in-out; position: relative; overflow: hidden;
            /* Initial state for GSAP animation */
            opacity: 0;
            transform: translateY(20px);
        }
        .note:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); background: linear-gradient(135deg, #eef1f5, #ffffff); }
        .note::before { content: ""; position: absolute; top: 0; left: 0; width: 5px; height: 100%; background: #4a90e2; border-radius: 12px 0 0 12px; }
        h3 { margin: 0 0 0.5rem 0; font-size: 1.3rem; color: #34495e; font-weight: 600; word-wrap: break-word; }
        p { margin-top: 0.75rem; font-size: 1rem; color: #555; line-height: 1.5; word-wrap: break-word; max-height: 120px; overflow: hidden; text-overflow: ellipsis;  }
        .date { font-size: 0.8rem; color: #7f8c8d; margin-top: 1rem; display: block; text-align: right; font-style: italic; }

        .action-btn {
            position: absolute;

            width: 36px; 
            height: 36px; 
            border-radius: 50%;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            background-color: transparent;
            color: #6b7280;
            transition: opacity 0.2s ease-in-out, transform 0.2s, color 0.2s;
        }
        .action-btn svg { 
            width: 20px; 
            height: 20px;
            stroke-width: 1.5; 
        }
        .action-btn:hover {
            transform: scale(1.1);
            background-color: rgba(0, 0, 0, 0.05); 
        }
        .note:hover .action-btn { opacity: 1; }

        .delete-btn { right: 8px; }
        .delete-btn:hover { color: #ef4444; }

        .archive-btn { right: 48px; }
        .archive-btn:hover { color: #f59e0b; }

        .unarchive-btn { right: 48px; }
        .unarchive-btn:hover { color: #10b981; } 


        /* --- Style Loading Indicator--- */
        .loading-indicator { display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); border: 6px solid #f3f3f3; border-top: 6px solid #4a90e2; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite; z-index: 10; }
        @keyframes spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
      </style>

      <div id="notesContainer" class="notes-grid"></div>
      <div class="loading-indicator"></div>
      <div class='empty-state' style="display: none;">${initialEmptyText}</div>
      <div class='error-state' style="display: none;">Gagal memuat catatan. Coba lagi nanti.</div>
    `;
  }

  updateNotesView() {
    const container = this.shadowRoot.querySelector("#notesContainer");
    const emptyState = this.shadowRoot.querySelector(".empty-state");
    const errorState = this.shadowRoot.querySelector(".error-state");

    container.innerHTML = "";
    errorState.style.display = "none";
    emptyState.style.display =
      this._notes.length === 0 && errorState.style.display === "none"
        ? "block"
        : "none";

    if (this._notes.length === 0) return;

    // Hero Icon svg
    const svgIconTrash = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
`;
    const svgIconArchive = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
</svg>
`;
    const svgIconUnarchive = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
</svg>
`;

    this._notes.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.classList.add("note");
      const formattedDate = new Date(note.createdAt).toLocaleDateString(
        "id-ID",
        { day: "numeric", month: "long", year: "numeric" },
      );

      const deleteButtonHtml = `<button class="delete-btn action-btn" data-id="${note.id}" title="Hapus Catatan">${svgIconTrash}</button>`;
      const archiveButtonHtml = `<button class="archive-btn action-btn" data-id="${note.id}" title="Arsipkan Catatan">${svgIconArchive}</button>`;
      const unarchiveButtonHtml = `<button class="unarchive-btn action-btn" data-id="${note.id}" title="Keluarkan dari Arsip">${svgIconUnarchive}</button>`;

      noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.body}</p>
            <span class="date">${formattedDate}</span>
            ${deleteButtonHtml}
            ${this._showArchived ? unarchiveButtonHtml : archiveButtonHtml}
        `;

      noteElement
        .querySelector(".delete-btn")
        .addEventListener("click", async (event) => {
          const noteId = event.target.closest("button").dataset.id;
          if (
            confirm(
              `Apakah Anda yakin ingin menghapus catatan "${note.title}"?`,
            )
          ) {
            await this.deleteNote(noteId);
          }
        });
      if (this._showArchived) {
        noteElement
          .querySelector(".unarchive-btn")
          .addEventListener("click", async (event) => {
            const noteId = event.target.closest("button").dataset.id;
            await this.unarchiveNote(noteId);
          });
      } else {
        noteElement
          .querySelector(".archive-btn")
          .addEventListener("click", async (event) => {
            const noteId = event.target.closest("button").dataset.id;
            await this.archiveNote(noteId);
          });
      }
      container.appendChild(noteElement);
    });

    // --- TAMBAHKAN ANIMASI GSAP ---
    gsap.to(container.querySelectorAll(".note"), {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: "power2.out",
    });
    // --- AKHIR ANIMASI GSAP ---
  }

  async fetchNotes() {
    this.showLoading();
    const errorState = this.shadowRoot.querySelector(".error-state");
    errorState.style.display = "none";
    const targetUrl = this._showArchived
      ? `${this._apiBaseUrl}/notes/archived`
      : `${this._apiBaseUrl}/notes`;
    try {
      const response = await fetch(targetUrl);
      const result = await response.json();
      if (result.status !== "success") {
        throw new Error(result.message || "Gagal mengambil data catatan.");
      }
      this._notes = result.data;
      this.updateNotesView();
    } catch (error) {
      console.error("Error saat memuat catatan:", error);
      this._notes = [];
      this.updateNotesView();
      errorState.textContent = `Gagal memuat catatan: ${error.message}`;
      errorState.style.display = "block";
      if (document.querySelector("note-modal")) {
        document
          .querySelector("note-modal")
          .showModal(`Error: ${error.message}`);
      }
    } finally {
      this.hideLoading();
    }
  }

  // Method deleteNote, archiveNote, unarchiveNote
  async deleteNote(noteId) {
    const noteModalElement = document.querySelector("note-modal");
    this.showLoading();
    try {
      const response = await fetch(`${this._apiBaseUrl}/notes/${noteId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.status !== "success")
        throw new Error(result.message || "Gagal menghapus catatan.");
      setTimeout(() => {
        if (noteModalElement)
          noteModalElement.showModal("Catatan berhasil dihapus!");
      }, 300);
      await this.fetchNotes();
    } catch (error) {
      console.error("Error saat menghapus catatan:", error);
      setTimeout(() => {
        if (noteModalElement)
          noteModalElement.showModal(
            `Gagal menghapus catatan: ${error.message}`,
          );
      }, 300);
    } finally {
      this.hideLoading();
    }
  }
  async archiveNote(noteId) {
    const noteModalElement = document.querySelector("note-modal");
    this.showLoading();
    try {
      const response = await fetch(
        `${this._apiBaseUrl}/notes/${noteId}/archive`,
        { method: "POST" },
      );
      const result = await response.json();
      if (result.status !== "success")
        throw new Error(result.message || "Gagal mengarsipkan catatan.");
      setTimeout(() => {
        if (noteModalElement)
          noteModalElement.showModal("Catatan berhasil diarsipkan!");
      }, 300);
      await this.fetchNotes();
    } catch (error) {
      console.error("Error saat mengarsipkan catatan:", error);
      setTimeout(() => {
        if (noteModalElement)
          noteModalElement.showModal(
            `Gagal mengarsipkan catatan: ${error.message}`,
          );
      }, 300);
    } finally {
      this.hideLoading();
    }
  }
  async unarchiveNote(noteId) {
    const noteModalElement = document.querySelector("note-modal");
    this.showLoading();
    try {
      const response = await fetch(
        `${this._apiBaseUrl}/notes/${noteId}/unarchive`,
        { method: "POST" },
      );
      const result = await response.json();
      if (result.status !== "success")
        throw new Error(result.message || "Gagal mengeluarkan dari arsip.");
      setTimeout(() => {
        if (noteModalElement)
          noteModalElement.showModal(
            "Catatan berhasil dikeluarkan dari arsip!",
          );
      }, 500);
      await this.fetchNotes();
    } catch (error) {
      console.error("Error saat mengeluarkan dari arsip:", error);
      setTimeout(() => {
        if (noteModalElement)
          noteModalElement.showModal(
            `Gagal mengeluarkan dari arsip: ${error.message}`,
          );
      }, 500);
    } finally {
      this.hideLoading();
    }
  }
}

customElements.define("note-list", NoteList);
