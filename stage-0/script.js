const dueDate = new Date('2026-03-01T18:00:00Z');

const remainingEl = document.querySelector('[data-testid="test-todo-time-remaining"]');
const statusEl = document.querySelector('[data-testid="test-todo-status"]');
const checkbox = document.getElementById("toggle");
const card = document.getElementById("card");
const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');

/* =========================
   TIME REMAINING LOGIC
========================= */
function updateTime() {
  const now = new Date();
  const diff = dueDate - now;

  const minutes = Math.floor(Math.abs(diff) / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let text = "";

  if (diff > 0) {
    if (days > 0) text = `Due in ${days} day${days > 1 ? "s" : ""}`;
    else if (hours > 0) text = `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
    else if (minutes > 0) text = `Due in ${minutes} minute${minutes > 1 ? "s" : ""}`;
    else text = "Due now!";
  } else {
    if (days > 0) text = `Overdue by ${days} day${days > 1 ? "s" : ""}`;
    else if (hours > 0) text = `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`;
    else text = `Overdue by ${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  remainingEl.textContent = text;
}

/* initial + interval update */
updateTime();
setInterval(updateTime, 60000);

/* =========================
   TOGGLE COMPLETE STATE
========================= */
checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    card.classList.add("completed");
    statusEl.textContent = "Done";
  } else {
    card.classList.remove("completed");
    statusEl.textContent = "Pending";
  }
});

/* =========================
   BUTTON ACTIONS
========================= */
editBtn.addEventListener("click", () => {
  console.log("edit clicked");
});

deleteBtn.addEventListener("click", () => {
  alert("Delete clicked");
});