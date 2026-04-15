// State management
let todoData = {
  title: "Finish UI Todo Card",
  description: "Build a fully accessible and responsive todo card with proper semantics and test IDs. This task involves implementing advanced features like edit mode, status transitions, priority indicators, expand/collapse functionality, and enhanced time management with overdue detection. The card should support keyboard navigation and screen reader accessibility.",
  priority: "High",
  status: "Pending",
  dueDate: new Date('2026-04-12T18:00:00Z'),
  tags: ["work", "urgent", "design"]
};

let isEditMode = false;
let timeUpdateInterval;

// DOM elements
const card = document.getElementById("card");
const checkbox = document.getElementById("toggle");
const titleEl = document.querySelector('[data-testid="test-todo-title"]');
const descriptionEl = document.querySelector('[data-testid="test-todo-description"]');
const priorityEl = document.querySelector('[data-testid="test-todo-priority"]');
const priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
const statusEl = document.querySelector('[data-testid="test-todo-status"]');
const statusControl = document.querySelector('[data-testid="test-todo-status-control"]');
const dueDateEl = document.querySelector('[data-testid="test-todo-due-date"]');
const timeRemainingEl = document.querySelector('[data-testid="test-todo-time-remaining"]');
const overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');
const expandToggle = document.querySelector('[data-testid="test-todo-expand-toggle"]');
const collapsibleSection = document.querySelector('[data-testid="test-todo-collapsible-section"]');
const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');

// Edit form elements
const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
const editTitleInput = document.querySelector('[data-testid="test-todo-edit-title-input"]');
const editDescriptionInput = document.querySelector('[data-testid="test-todo-edit-description-input"]');
const editPrioritySelect = document.querySelector('[data-testid="test-todo-edit-priority-select"]');
const editDueDateInput = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');
const saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
const cancelBtn = document.querySelector('[data-testid="test-todo-cancel-button"]');

/* =========================
   TIME REMAINING LOGIC
========================= */
function updateTime() {
  if (todoData.status === "Done") {
    timeRemainingEl.textContent = "Completed";
    overdueIndicator.classList.remove("visible");
    card.classList.remove("overdue");
    return;
  }

  const now = new Date();
  const diff = todoData.dueDate - now;
  const isOverdue = diff < 0;

  const minutes = Math.floor(Math.abs(diff) / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let text = "";

  if (!isOverdue) {
    if (days > 0) text = `Due in ${days} day${days > 1 ? "s" : ""}`;
    else if (hours > 0) text = `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
    else if (minutes > 0) text = `Due in ${minutes} minute${minutes > 1 ? "s" : ""}`;
    else text = "Due now!";
  } else {
    if (days > 0) text = `Overdue by ${days} day${days > 1 ? "s" : ""}`;
    else if (hours > 0) text = `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`;
    else text = `Overdue by ${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  timeRemainingEl.textContent = text;

  // Handle overdue indicator
  if (isOverdue) {
    overdueIndicator.textContent = "Overdue";
    overdueIndicator.classList.add("visible");
    card.classList.add("overdue");
  } else {
    overdueIndicator.classList.remove("visible");
    card.classList.remove("overdue");
  }
}

/* =========================
   UI UPDATE FUNCTIONS
========================= */
function updateUI() {
  // Update title and description
  titleEl.textContent = todoData.title;
  descriptionEl.textContent = todoData.description;

  // Update priority
  priorityEl.textContent = todoData.priority;
  priorityEl.className = `badge ${todoData.priority.toLowerCase()}`;
  priorityIndicator.setAttribute("data-priority", todoData.priority.toLowerCase());
  priorityIndicator.setAttribute("aria-label", `${todoData.priority} priority`);

  // Update status
  statusEl.textContent = todoData.status;
  statusControl.value = todoData.status;

  // Update visual states
  updateVisualStates();

  // Update due date display
  const dateStr = todoData.dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  dueDateEl.textContent = `Due ${dateStr}`;
  dueDateEl.setAttribute('datetime', todoData.dueDate.toISOString());

  // Update time
  updateTime();
}

function updateVisualStates() {
  // Remove all state classes
  card.classList.remove("completed", "in-progress", "high-priority", "overdue");

  // Add status-based classes
  if (todoData.status === "Done") {
    card.classList.add("completed");
    checkbox.checked = true;
  } else if (todoData.status === "In Progress") {
    card.classList.add("in-progress");
    checkbox.checked = false;
  } else {
    checkbox.checked = false;
  }

  // Add priority-based classes
  if (todoData.priority === "High") {
    card.classList.add("high-priority");
  }
}

/* =========================
   EXPAND/COLLAPSE LOGIC
========================= */
function toggleExpand() {
  const isExpanded = expandToggle.getAttribute("aria-expanded") === "true";

  if (isExpanded) {
    expandToggle.setAttribute("aria-expanded", "false");
    expandToggle.textContent = "Show more";
    collapsibleSection.classList.remove("expanded");
    collapsibleSection.setAttribute("aria-hidden", "true");
  } else {
    expandToggle.setAttribute("aria-expanded", "true");
    expandToggle.textContent = "Show less";
    collapsibleSection.classList.add("expanded");
    collapsibleSection.setAttribute("aria-hidden", "false");
  }
}

// Check if description needs expand toggle and ensure it's collapsed after updates
function checkDescriptionLength() {
  const descriptionText = todoData.description;
  const maxLength = 100; // Adjust as needed

  if (descriptionText.length > maxLength) {
    expandToggle.style.display = "inline-block";
    expandToggle.setAttribute("aria-expanded", "false");
    expandToggle.textContent = "Show more";
    descriptionEl.textContent = descriptionText.substring(0, maxLength) + "...";
    collapsibleSection.textContent = descriptionText;
    collapsibleSection.classList.remove("expanded");
    collapsibleSection.setAttribute("aria-hidden", "true");
    collapsibleSection.style.display = "block";
  } else {
    expandToggle.style.display = "none";
    descriptionEl.textContent = descriptionText;
    collapsibleSection.style.display = "none";
  }
}

/* =========================
   EDIT MODE LOGIC
========================= */
function enterEditMode() {
  if (isEditMode) return;

  isEditMode = true;

  // Populate form with current data
  editTitleInput.value = todoData.title;
  editDescriptionInput.value = todoData.description;
  editPrioritySelect.value = todoData.priority;
  editDueDateInput.value = todoData.dueDate.toISOString().slice(0, 16);

  // Show form, hide main content
  editForm.style.display = "block";
  card.querySelectorAll(':not(.edit-form)').forEach(el => {
    if (!editForm.contains(el)) {
      el.style.display = "none";
    }
  });

  // Focus management
  editTitleInput.focus();
}

function exitEditMode() {
  if (!isEditMode) return;

  isEditMode = false;

  // Hide form, show main content
  editForm.style.display = "none";
  card.querySelectorAll('*').forEach(el => {
    el.style.display = "";
  });

  // Return focus to edit button
  editBtn.focus();
}

function saveEdit() {
  // Update data
  todoData.title = editTitleInput.value.trim() || "Untitled Task";
  todoData.description = editDescriptionInput.value.trim() || "No description";
  todoData.priority = editPrioritySelect.value;
  todoData.dueDate = new Date(editDueDateInput.value);

  // Update UI
  updateUI();
  checkDescriptionLength();

  // Exit edit mode
  exitEditMode();
}

function cancelEdit() {
  exitEditMode();
}

/* =========================
   STATUS CONTROL LOGIC
========================= */
function handleStatusChange() {
  const newStatus = statusControl.value;
  todoData.status = newStatus;

  // Sync checkbox
  if (newStatus === "Done") {
    checkbox.checked = true;
  } else {
    checkbox.checked = false;
  }

  updateUI();
}

/* =========================
   CHECKBOX LOGIC
========================= */
function handleCheckboxChange() {
  if (checkbox.checked) {
    todoData.status = "Done";
    statusControl.value = "Done";
  } else {
    todoData.status = "Pending";
    statusControl.value = "Pending";
  }

  updateUI();
}

/* =========================
   EVENT LISTENERS
========================= */
editBtn.addEventListener("click", enterEditMode);
saveBtn.addEventListener("click", saveEdit);
cancelBtn.addEventListener("click", cancelEdit);
statusControl.addEventListener("change", handleStatusChange);
checkbox.addEventListener("change", handleCheckboxChange);
expandToggle.addEventListener("click", toggleExpand);

deleteBtn.addEventListener("click", () => {
  alert("Delete clicked");
});

/* =========================
   INITIALIZATION
========================= */
function init() {
  updateUI();
  checkDescriptionLength();

  // Start time updates
  updateTime();
  timeUpdateInterval = setInterval(updateTime, 30000); // Update every 30 seconds
}

// Initialize the app
init();