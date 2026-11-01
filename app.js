/**
 * PEGASUS // CYBER INTEL FILE EXPLORER ENGINE
 */

// Global File System Store
let mockFileSystem = [
  {
    id: "f1",
    folderId: "root",
    name: "Target_Alpha_Dossier.pdf",
    type: "document",
    size: "3.4 MB",
    sizeBytes: 3565158,
    date: "2025-02-23 11:20",
    classification: "top-secret",
    target: "Target_Alpha (+972-50-8882)",
    preview: "CLASSIFIED PEGASUS INTEL REPORT\n----------------------------------------\nTarget ID: TA-9921-X\nGeo Coordinates: 32.0853° N, 34.7818° E\nStatus: Active Intercept\nPrimary App: WhatsApp Business / Signal Encrypted Socket\nKey Findings: Financial transfers linked to offshore account."
  },
  {
    id: "f2",
    folderId: "root",
    name: "Call_Intercept_20250223.wav",
    type: "audio",
    size: "14.2 MB",
    sizeBytes: 14889779,
    date: "2025-02-23 09:45",
    classification: "top-secret",
    target: "Target_Alpha (+972-50-8882)",
    preview: "[AUDIO WAVEFORM INTERCEPT]\n00:00 - [Speaker A]: The package will arrive at port gate 4 at midnight.\n00:04 - [Speaker B]: Confirmed. Encryption key pre-loaded on device.\n00:09 - [Signal Noise / Decrypted Stream Success]"
  },
  {
    id: "f3",
    folderId: "root",
    name: "surveillance_snapshot_09.jpg",
    type: "image",
    size: "2.1 MB",
    sizeBytes: 2202009,
    date: "2025-02-22 18:30",
    classification: "classified",
    target: "CCTV Intercept Node #12",
    preview: "SVG IMAGE TELEMETRY METADATA:\nResolution: 3840x2160 UHD\nThermal Layer: Detected\nFace Match Index: 98.7% Confidence (Match: Target_Alpha)"
  },
  {
    id: "f4",
    folderId: "root",
    name: "decryption_rsa_key.pem",
    type: "key",
    size: "4 KB",
    sizeBytes: 4096,
    date: "2025-02-21 14:10",
    classification: "top-secret",
    target: "Local Cryptographic Engine",
    preview: "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0Z5XQ7hT8v... [PEGASUS AES-256 SYMMETRIC CIPHER KEY]\ne398ab71003f421a99cd128a55bfe301a2c91834190fa728109ad\n-----END RSA PRIVATE KEY-----"
  },
  {
    id: "f5",
    folderId: "target_alpha",
    name: "Telegram_Export_Chat.txt",
    type: "document",
    size: "820 KB",
    sizeBytes: 839680,
    date: "2025-02-23 08:12",
    classification: "classified",
    target: "Target_Alpha",
    preview: "[2025-02-23 08:10:02] Target: Deploy payload to node 7.\n[2025-02-23 08:11:15] Unknown: Ack. Waiting for RSA token validation."
  },
  {
    id: "f6",
    folderId: "audio_intercepts",
    name: "VoiceNote_Signal_004.wav",
    type: "audio",
    size: "5.8 MB",
    sizeBytes: 6081740,
    date: "2025-02-22 22:04",
    classification: "top-secret",
    target: "Target_Beta",
    preview: "[AUDIO DECRYPTION SUCCESSFUL]\nAudio Sample Rate: 44.1 kHz\nTranscribed Text: 'Meeting location moved to underground terminal B.'"
  },
  {
    id: "f7",
    folderId: "surveillance_media",
    name: "Satellite_Thermal_Cam.mp4",
    type: "image",
    size: "45.0 MB",
    sizeBytes: 47185920,
    date: "2025-02-20 16:50",
    classification: "normal",
    target: "Orbital Recon Satellite #4",
    preview: "FRAME STREAM INFO:\nFPS: 60 | Codec: H.265 Encrypted\nLocation Pin: 32.0853, 34.7818"
  }
];

// App State
let currentFolderId = "root";
let currentViewMode = "grid"; // 'grid' or 'list'
let searchQuery = "";
let selectedType = "all";
let currentSort = "name";
let activeFileModal = null;

// DOM Elements
const fileContainer = document.getElementById("fileContainer");
const emptyState = document.getElementById("emptyState");
const itemCountEl = document.getElementById("itemCount");
const currentFolderNameEl = document.getElementById("currentFolderName");
const breadcrumbEl = document.getElementById("breadcrumb");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearch");
const typeFilter = document.getElementById("typeFilter");
const sortSelect = document.getElementById("sortSelect");

const gridViewBtn = document.getElementById("gridViewBtn");
const listViewBtn = document.getElementById("listViewBtn");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const scanBtn = document.getElementById("scanBtn");
const newFolderBtn = document.getElementById("newFolderBtn");
const uploadFileBtn = document.getElementById("uploadFileBtn");
const hiddenFileInput = document.getElementById("hiddenFileInput");

// Modal Elements
const previewModal = document.getElementById("previewModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalFileName = document.getElementById("modalFileName");
const modalFileType = document.getElementById("modalFileType");
const modalFileSize = document.getElementById("modalFileSize");
const modalFileDate = document.getElementById("modalFileDate");
const modalFileTarget = document.getElementById("modalFileTarget");
const modalClass = document.getElementById("modalClass");
const modalPreviewContent = document.getElementById("modalPreviewContent");
const shredFileBtn = document.getElementById("shredFileBtn");
const downloadFileBtn = document.getElementById("downloadFileBtn");

const folderModal = document.getElementById("folderModal");
const closeFolderModalBtn = document.getElementById("closeFolderModalBtn");
const cancelFolderBtn = document.getElementById("cancelFolderBtn");
const confirmFolderBtn = document.getElementById("confirmFolderBtn");
const folderNameInput = document.getElementById("folderNameInput");

const terminalLogs = document.getElementById("terminalLogs");
const clearLogsBtn = document.getElementById("clearLogsBtn");
const toastContainer = document.getElementById("toastContainer");

// Folder Display Names Mapping
const folderNames = {
  root: "Root Intel Directory",
  target_alpha: "Target Alpha Vault",
  audio_intercepts: "Call Intercepts",
  surveillance_media: "Surveillance Cam",
  encrypted_keys: "Decryption Keys"
};

// SVG Icons Factory
function getFileIconSVG(type) {
  switch (type) {
    case "folder":
      return `<svg class="icon-folder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
    case "audio":
      return `<svg class="icon-audio" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>`;
    case "image":
      return `<svg class="icon-image" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`;
    case "key":
      return `<svg class="icon-key" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-2-2l2 2m2 4l-4 4-2-2 1.5-1.5M15.5 12.5l-2-2M10 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"></path></svg>`;
    case "document":
    default:
      return `<svg class="icon-document" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;
  }
}

// Initial Setup
document.addEventListener("DOMContentLoaded", () => {
  renderFiles();
  updateSidebarBadges();
  setupEventListeners();
  addLog("System initialized. Active socket connected to Pegasus relay.");
});

// Event Listeners Registration
function setupEventListeners() {
  // Navigation sidebar
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
      item.classList.add("active");
      currentFolderId = item.dataset.folder;
      closeSidebar();
      renderFiles();
    });
  });

  // Mobile menu toggle
  mobileMenuBtn.addEventListener("click", toggleSidebar);
  sidebarOverlay.addEventListener("click", closeSidebar);

  // Search input
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    if (searchQuery) {
      clearSearchBtn.classList.add("visible");
    } else {
      clearSearchBtn.classList.remove("visible");
    }
    renderFiles();
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.classList.remove("visible");
    renderFiles();
  });

  // Filters and Sorting
  typeFilter.addEventListener("change", (e) => {
    selectedType = e.target.value;
    renderFiles();
  });

  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderFiles();
  });

  // View switch buttons
  gridViewBtn.addEventListener("click", () => {
    currentViewMode = "grid";
    gridViewBtn.classList.add("active");
    listViewBtn.classList.remove("active");
    fileContainer.classList.remove("list-view");
  });

  listViewBtn.addEventListener("click", () => {
    currentViewMode = "list";
    listViewBtn.classList.add("active");
    gridViewBtn.classList.remove("active");
    fileContainer.classList.add("list-view");
  });

  // Action Buttons
  scanBtn.addEventListener("click", runCyberScan);
  newFolderBtn.addEventListener("click", () => folderModal.classList.remove("hidden"));
  closeFolderModalBtn.addEventListener("click", () => folderModal.classList.add("hidden"));
  cancelFolderBtn.addEventListener("click", () => folderModal.classList.add("hidden"));
  confirmFolderBtn.addEventListener("click", createNewFolder);

  uploadFileBtn.addEventListener("click", () => hiddenFileInput.click());
  hiddenFileInput.addEventListener("change", handleFileUpload);

  // Modals
  closeModalBtn.addEventListener("click", () => previewModal.classList.add("hidden"));
  shredFileBtn.addEventListener("click", shredActiveFile);
  downloadFileBtn.addEventListener("click", exportActiveFile);

  clearLogsBtn.addEventListener("click", () => {
    terminalLogs.innerHTML = "";
    addLog("Terminal logs cleared.");
  });
}

// Render Files and Folders
function renderFiles() {
  // Update Current Folder Title
  currentFolderNameEl.textContent = folderNames[currentFolderId] || currentFolderId;
  renderBreadcrumbs();

  // Filter items
  let filtered = mockFileSystem.filter(item => {
    const matchesFolder = item.folderId === currentFolderId;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery) ||
                          (item.target && item.target.toLowerCase().includes(searchQuery));
    const matchesType = selectedType === "all" ? true : item.type === selectedType;

    return matchesFolder && matchesSearch && matchesType;
  });

  // Sorting items
  filtered.sort((a, b) => {
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;

    if (currentSort === "name") {
      return a.name.localeCompare(b.name);
    } else if (currentSort === "size") {
      return (b.sizeBytes || 0) - (a.sizeBytes || 0);
    } else if (currentSort === "date") {
      return new Date(b.date) - new Date(a.date);
    } else if (currentSort === "class") {
      return (a.classification || "").localeCompare(b.classification || "");
    }
    return 0;
  });

  // Item Count Display
  itemCountEl.textContent = `${filtered.length} item${filtered.length === 1 ? "" : "s"}`;

  // Clear container
  fileContainer.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  } else {
    emptyState.classList.add("hidden");
  }

  // Populate Grid/List items
  filtered.forEach(file => {
    const card = document.createElement("div");
    card.className = "file-card";
    
    // Icon SVG
    const iconHTML = getFileIconSVG(file.type);
    const classBadgeHTML = file.classification ? 
      `<span class="badge-tag ${file.classification}">${file.classification.replace('-', ' ')}</span>` : '';

    card.innerHTML = `
      <div class="card-top">
        <div class="file-icon-wrapper">
          ${iconHTML}
        </div>
        ${classBadgeHTML}
      </div>
      <div class="card-details">
        <div class="file-name" title="${file.name}">${file.name}</div>
        <div class="file-meta-sub">
          <span>${file.size || "Folder"}</span>
          <span>${file.date ? file.date.split(' ')[0] : ''}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="action-btn btn-inspect" title="Inspect Intel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        </button>
        <button class="action-btn btn-del" title="Shred / Delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    `;

    // Click handler for inspecting or opening folder
    card.addEventListener("click", (e) => {
      if (e.target.closest(".btn-del")) {
        e.stopPropagation();
        deleteFile(file.id);
      } else if (file.type === "folder") {
        currentFolderId = file.targetFolderId || "root";
        renderFiles();
      } else {
        openFileModal(file);
      }
    });

    fileContainer.appendChild(card);
  });
}

// Breadcrumb trail builder
function renderBreadcrumbs() {
  breadcrumbEl.innerHTML = "";

  const rootItem = document.createElement("span");
  rootItem.className = "bc-item";
  rootItem.textContent = "Root Intel";
  rootItem.addEventListener("click", () => {
    currentFolderId = "root";
    renderFiles();
  });
  breadcrumbEl.appendChild(rootItem);

  if (currentFolderId !== "root") {
    const sep = document.createElement("span");
    sep.className = "bc-separator";
    sep.textContent = "/";
    breadcrumbEl.appendChild(sep);

    const folderItem = document.createElement("span");
    folderItem.className = "bc-item";
    folderItem.textContent = folderNames[currentFolderId] || currentFolderId;
    breadcrumbEl.appendChild(folderItem);
  }
}

// Modal open file detail
function openFileModal(file) {
  activeFileModal = file;
  modalFileName.textContent = file.name;
  modalFileType.textContent = file.type.toUpperCase() + " / ENCRYPTED";
  modalFileSize.textContent = file.size || "Unknown";
  modalFileDate.textContent = file.date || "N/A";
  modalFileTarget.textContent = file.target || "Unknown Node";
  modalClass.textContent = (file.classification || "SECRET").replace('-', ' ').toUpperCase();
  modalClass.className = `badge-tag ${file.classification || 'normal'}`;

  modalPreviewContent.textContent = file.preview || "No telemetry stream available for this entry.";
  previewModal.classList.remove("hidden");

  addLog(`Inspected payload file: [${file.name}]`);
}

// Shred file action
function shredActiveFile() {
  if (!activeFileModal) return;
  const name = activeFileModal.name;
  deleteFile(activeFileModal.id);
  previewModal.classList.add("hidden");
  showToast(`File shredded and erased: ${name}`, "danger");
}

function exportActiveFile() {
  if (!activeFileModal) return;
  showToast(`Exported payload: ${activeFileModal.name}`, "success");
  addLog(`Payload exported to encrypted buffer: [${activeFileModal.name}]`);
}

// Delete file logic
function deleteFile(id) {
  const index = mockFileSystem.findIndex(item => item.id === id);
  if (index !== -1) {
    const removed = mockFileSystem.splice(index, 1)[0];
    renderFiles();
    updateSidebarBadges();
    addLog(`Permanently destroyed file record: ${removed.name}`, "text-red");
    showToast(`Shredded item: ${removed.name}`);
  }
}

// Create Folder logic
function createNewFolder() {
  const name = folderNameInput.value.trim();
  if (!name) {
    showToast("Please enter a folder name", "danger");
    return;
  }

  const folderId = "folder_" + Date.now();
  const newFolder = {
    id: folderId,
    folderId: currentFolderId,
    targetFolderId: folderId,
    name: name,
    type: "folder",
    size: "--",
    date: new Date().toISOString().slice(0, 16).replace("T", " "),
    classification: "classified",
    target: "Cyber Vault"
  };

  mockFileSystem.unshift(newFolder);
  folderNames[folderId] = name;
  folderNameInput.value = "";
  folderModal.classList.add("hidden");

  renderFiles();
  updateSidebarBadges();
  showToast(`Created Cyber Vault: ${name}`, "success");
  addLog(`New Intel Vault created: [${name}]`);
}

// Handle Mock File Import
function handleFileUpload(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  for (let file of files) {
    let ext = file.name.split('.').pop().toLowerCase();
    let type = "document";
    if (["wav", "mp3", "aac"].includes(ext)) type = "audio";
    if (["jpg", "png", "gif", "mp4"].includes(ext)) type = "image";
    if (["pem", "key", "exe", "bin"].includes(ext)) type = "key";

    const newItem = {
      id: "import_" + Date.now() + Math.random().toString(36).substr(2, 4),
      folderId: currentFolderId,
      name: file.name,
      type: type,
      size: (file.size / 1024).toFixed(1) + " KB",
      sizeBytes: file.size,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      classification: "top-secret",
      target: "Manual Intercept Import",
      preview: `HEX CIPHER DECODE [${file.name}]\nImported file stream verified. Hash match 100% SHA-256.`
    };

    mockFileSystem.unshift(newItem);
  }

  hiddenFileInput.value = "";
  renderFiles();
  updateSidebarBadges();
  showToast(`Imported ${files.length} file(s) into vault`, "success");
  addLog(`Imported ${files.length} external payload stream(s).`);
}

// Cyber System Scan Animation
function runCyberScan() {
  scanBtn.disabled = true;
  scanBtn.innerHTML = `SCANNING...`;
  addLog("Initiating full cyber diagnostic scan...", "text-amber");

  let step = 0;
  const interval = setInterval(() => {
    step++;
    if (step === 1) {
      addLog("Checking RSA decryption key integrity...", "text-cyan");
    } else if (step === 2) {
      addLog("Analyzing encrypted audio buffers...", "text-cyan");
    } else if (step === 3) {
      addLog("0 Security Vulnerabilities Found. Socket Secure.", "text-green");
      clearInterval(interval);
      scanBtn.disabled = false;
      scanBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
        RUN SYSTEM SCAN`;
      showToast("System Scan Complete: 0 Threat Vectors", "success");
    }
  }, 700);
}

// Sidebar Badges update
function updateSidebarBadges() {
  const rootCount = mockFileSystem.filter(f => f.folderId === "root").length;
  const alphaCount = mockFileSystem.filter(f => f.folderId === "target_alpha").length;
  const audioCount = mockFileSystem.filter(f => f.folderId === "audio_intercepts").length;
  const mediaCount = mockFileSystem.filter(f => f.folderId === "surveillance_media").length;

  document.getElementById("badgeRoot").textContent = rootCount;
  document.getElementById("badgeAlpha").textContent = alphaCount;
  document.getElementById("badgeCalls").textContent = audioCount;
  document.getElementById("badgeMedia").textContent = mediaCount;
}

// Terminal Logging Helper
function addLog(msg, colorClass = "text-cyan") {
  const time = new Date().toTimeString().split(' ')[0];
  const line = document.createElement("div");
  line.className = `log-line ${colorClass}`;
  line.textContent = `[${time}] ${msg}`;
  terminalLogs.appendChild(line);
  terminalLogs.scrollTop = terminalLogs.scrollHeight;
}

// Toast System
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = "toast";

  let iconColor = type === "danger" ? "danger" : (type === "success" ? "success" : "");
  toast.innerHTML = `
    <svg class="toast-icon ${iconColor}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Mobile Menu toggles
function toggleSidebar() {
  sidebar.classList.toggle("open");
  sidebarOverlay.classList.toggle("active");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("active");
}
