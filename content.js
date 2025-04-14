let currentTask = null; // Store the task locally
let allowClose = false; // Flag to allow tab closure programmatically

// Display the task at the top of the page
function displayTask(task) {
    let taskBar = document.getElementById('task-reminder-bar');
    if (!taskBar) {
        taskBar = document.createElement('div');
        taskBar.id = 'task-reminder-bar';
        taskBar.style.position = 'fixed';
        taskBar.style.top = '10px';
        taskBar.style.right = '10px';
        taskBar.style.backgroundColor = '#ffeb3b';
        taskBar.style.padding = '10px';
        taskBar.style.border = '1px solid #ccc';
        taskBar.style.zIndex = '9999';
        document.body.appendChild(taskBar);
    }
    taskBar.innerHTML = `<strong>Your Task:</strong> ${task}`;
}

// List of websites to automatically prompt for a task
const targetWebsites = ["facebook.com", "instagram.com"];

// Check if the current URL matches any target website
const currentURL = window.location.href;
if (targetWebsites.some((site) => currentURL.includes(site))) {
    if (!currentTask) {
        const task = prompt("What is your task for this website?");
        if (task) {
            currentTask = task;
            displayTask(task);

            // Save the task to storage
            chrome.runtime.sendMessage({ action: "saveTask", url: currentURL, task: task });
        }
    }
}

// Check storage for this URL's task
chrome.runtime.sendMessage({action: "getTask", url: window.location.href}, (response) => {
    if (response?.task) {
        currentTask = response.task; // Store the task locally
        displayTask(response.task);
    }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "displayTask") {
        currentTask = message.task; // Update the local task
        displayTask(message.task);
    }
});

// Intercept page closing
window.addEventListener('beforeunload', (e) => {
    if (currentTask && !allowClose) {
        e.preventDefault();
        e.returnValue = ''; // Required for some browsers

        // Show a custom confirmation dialog
        const confirmed = confirm(`Have you completed your task: "${currentTask}"?`);
        if (confirmed) {
            allowClose = true; // Allow the tab to close
            window.location.reload(); // Trigger the unload event again
        } else {
            console.log('Make sure you complete your task.');
        }
    }
});

// Detect when the user switches tabs or minimizes the window
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && currentTask) {
        // Gently remind the user about their task
        if (Notification.permission === 'granted') {
            new Notification("Don't forget to finish your task!", {
                body: `Task: "${currentTask}"`,
                icon: 'icon.png' // Optional: Add an icon for the notification
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification("Don't forget to finish your task!", {
                        body: `Task: "${currentTask}"`,
                        icon: 'icon.png'
                    });
                }
            });
        }
    }
});