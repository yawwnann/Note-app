import "./styles/style.css";
import "./components/noteForm.js";
import "./components/noteList.js";
import "./components/noteModal.js";

console.log("App loaded successfully!");
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleArchivedView");

  const noteListElement = document.querySelector("note-list");
  let isShowingArchived = false;

  if (toggleBtn && noteListElement) {
    toggleBtn.addEventListener("click", () => {
      isShowingArchived = !isShowingArchived;
      noteListElement.toggleArchivedView(isShowingArchived);

      toggleBtn.textContent = isShowingArchived
        ? "Tampilkan Catatan Aktif"
        : "Tampilkan Catatan Terarsip";
    });
  }
});
