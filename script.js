// Initial State
let taskData = {
    title: "Finish Project Proposal",
    desc: "Review final draft. This is a longer description to test the collapse feature.",
    priority: "High",
    status: "Pending",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 3) // 3 hours from now
};

// Elements
const card = document.getElementById('main-card');
const displayMode = document.getElementById('display-mode');
const editMode = document.getElementById('edit-mode');

// Sync Logic: Checkbox vs Status Control
const checkbox = document.getElementById('complete-checkbox');
const statusControl = document.getElementById('status-control');

function syncStatus(newStatus) {
    taskData.status = newStatus;
    statusControl.value = newStatus;
    checkbox.checked = (newStatus === "Done");
    
    // Update visuals
    card.classList.remove('status-done', 'status-progress');
    if (newStatus === "Done") card.classList.add('status-done');
    if (newStatus === "In Progress") card.classList.add('status-progress');
    
    document.getElementById('view-status').textContent = newStatus;
    renderTime();
}

checkbox.addEventListener('change', () => syncStatus(checkbox.checked ? "Done" : "Pending"));
statusControl.addEventListener('change', (e) => syncStatus(e.target.value));

// Time Management Logic
function renderTime() {
    const timeEl = document.getElementById('view-time-remaining');
    const overdueEl = document.getElementById('overdue-indicator');
    const dueDateEl = document.getElementById('view-due-date');

    dueDateEl.textContent = "Due: " + taskData.dueDate.toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});

    if (taskData.status === "Done") {
        timeEl.textContent = "Completed";
        timeEl.classList.remove('overdue-text');
        overdueEl.classList.add('hidden');
        return;
    }

    const diff = taskData.dueDate - new Date();
    const absDiff = Math.abs(diff);
    
    const d = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const h = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((absDiff / (1000 * 60)) % 60);

    let timeStr = d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;
    
    if (diff < 0) {
        timeEl.textContent = `Overdue by ${timeStr}`;
        timeEl.classList.add('overdue-text');
        overdueEl.classList.remove('hidden');
    } else {
        timeEl.textContent = `Due in ${timeStr}`;
        timeEl.classList.remove('overdue-text');
        overdueEl.classList.add('hidden');
    }
}

// Edit Mode Logic
document.getElementById('edit-btn').addEventListener('click', () => {
    displayMode.classList.add('hidden');
    editMode.classList.remove('hidden');
    
    document.getElementById('edit-title').value = taskData.title;
    document.getElementById('edit-desc').value = taskData.desc;
    document.getElementById('edit-priority').value = taskData.priority;
    document.getElementById('edit-date').value = taskData.dueDate.toISOString().slice(0, 16);
});

document.getElementById('save-btn').addEventListener('click', () => {
    taskData.title = document.getElementById('edit-title').value;
    taskData.desc = document.getElementById('edit-desc').value;
    taskData.priority = document.getElementById('edit-priority').value;
    taskData.dueDate = new Date(document.getElementById('edit-date').value);
    
    // Update display text
    document.getElementById('view-title').textContent = taskData.title;
    document.getElementById('view-description').textContent = taskData.desc;
    document.getElementById('view-priority').textContent = taskData.priority;
    card.className = `todo-card p-${taskData.priority}`;
    
    closeEdit();
});

document.getElementById('cancel-btn').addEventListener('click', closeEdit);

function closeEdit() {
    editMode.classList.add('hidden');
    displayMode.classList.remove('hidden');
    renderTime();
    document.getElementById('edit-btn').focus();
}

// Expand/Collapse Logic
document.getElementById('expand-btn').addEventListener('click', function() {
    const section = document.getElementById('collapsible-section');
    const isCollapsed = section.classList.toggle('collapsed');
    this.setAttribute('aria-expanded', !isCollapsed);
    this.textContent = isCollapsed ? "Show More" : "Show Less";
});

// Init
setInterval(renderTime, 30000);
syncStatus("Pending");
card.className = `todo-card p-High`;