let currentTask = null;
let allowClose = false;
let taskCompleted = false;
let countdownInterval = null;
let countdownTimeInSeconds = 0;

// Display the task at the top of the page
function displayTask(task, timeInMinutes = null) {
    let taskBar = document.getElementById('task-reminder-bar');
    if (!taskBar) {
        taskBar = document.createElement('div');
        taskBar.id = 'task-reminder-bar';
        taskBar.style.position = 'fixed';
        taskBar.style.top = '10px';
        taskBar.style.right = '10px';
        taskBar.style.backgroundColor = '#2c3e50'; // Darker background color
        taskBar.style.color = '#ffffff'; // White text
        taskBar.style.padding = '12px';
        taskBar.style.borderRadius = '5px';
        taskBar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        taskBar.style.zIndex = '9999';
        document.body.appendChild(taskBar);
    }

    let timerHtml = '';
    if (timeInMinutes) {
        countdownTimeInSeconds = timeInMinutes * 60;
        const minutes = Math.floor(countdownTimeInSeconds / 60);
        const seconds = countdownTimeInSeconds % 60;
        timerHtml = `
            <div class="countdown-timer" style="margin-left: 10px; display: inline-block;">
                <span class="timer-icon">⏱️</span>
                <span id="countdown-display">${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</span>
            </div>
        `;
        
        // Start the countdown
        startCountdown();
    }

    taskBar.innerHTML = `
        <strong>Your Task:</strong> ${task}
        ${timerHtml}
        <button id="mark-completed" style="margin-left: 10px; padding: 6px 12px; background-color: #27ae60; color: white; border: none; border-radius: 3px; cursor: pointer; font-weight: bold;">
            Mark as Completed
        </button>
    `;

    // Add event listener to the "Mark as Completed" button
    document.getElementById('mark-completed').addEventListener('click', () => {
        markTaskAsCompleted();
    });
}

function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    countdownInterval = setInterval(() => {
        countdownTimeInSeconds--;
        
        if (countdownTimeInSeconds <= 0) {
            clearInterval(countdownInterval);
            showTimeUpNotification();
        }
        
        const minutes = Math.floor(countdownTimeInSeconds / 60);
        const seconds = countdownTimeInSeconds % 60;
        const countdownDisplay = document.getElementById('countdown-display');
        if (countdownDisplay) {
            countdownDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function showTimeUpNotification() {
    const timeUpDiv = document.createElement('div');
    timeUpDiv.id = 'time-up-notification';
    timeUpDiv.style.position = 'fixed';
    timeUpDiv.style.top = '50%';
    timeUpDiv.style.left = '50%';
    timeUpDiv.style.transform = 'translate(-50%, -50%)';
    timeUpDiv.style.backgroundColor = '#e74c3c';
    timeUpDiv.style.color = 'white';
    timeUpDiv.style.padding = '20px';
    timeUpDiv.style.borderRadius = '10px';
    timeUpDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    timeUpDiv.style.zIndex = '10001';
    timeUpDiv.style.fontSize = '20px';
    timeUpDiv.style.textAlign = 'center';
    timeUpDiv.style.fontWeight = 'bold';
    timeUpDiv.innerHTML = 'Your time\'s up!<br><span style="font-size:16px; font-weight:normal;">Have you completed your task?</span>';
    document.body.appendChild(timeUpDiv);

    setTimeout(() => {
        if (document.body.contains(timeUpDiv)) {
            document.body.removeChild(timeUpDiv);
        }
    }, 5000);
}

// Mark the task as completed
function markTaskAsCompleted() {
    taskCompleted = true;
    allowClose = true;
    currentTask = null;

    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    const congratsDiv = document.createElement('div');
    congratsDiv.id = 'congrats-animation';
    congratsDiv.style.position = 'fixed';
    congratsDiv.style.top = '50%';
    congratsDiv.style.left = '50%';
    congratsDiv.style.transform = 'translate(-50%, -50%)';
    congratsDiv.style.backgroundColor = '#4caf50';
    congratsDiv.style.color = 'white';
    congratsDiv.style.padding = '20px';
    congratsDiv.style.borderRadius = '10px';
    congratsDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    congratsDiv.style.zIndex = '10000';
    congratsDiv.style.fontSize = '18px';
    congratsDiv.innerText = 'Congrats! You can close this tab or stay focused!';
    document.body.appendChild(congratsDiv);

    setTimeout(() => {
        document.body.removeChild(congratsDiv);
    }, 3000);

    const taskBar = document.getElementById('task-reminder-bar');
    if (taskBar) {
        document.body.removeChild(taskBar);
    }
}

let targetWebsites = ["facebook.com", "instagram.com"];

function loadTargetWebsites() {
    chrome.storage.sync.get('targetWebsites', (result) => {
        if (result.targetWebsites && Array.isArray(result.targetWebsites)) {
            targetWebsites = result.targetWebsites;
            checkCurrentUrlForPrompt();
        }
    });
}

function checkCurrentUrlForPrompt() {
    const currentURL = window.location.href;
    if (targetWebsites.some((site) => currentURL.includes(site))) {
        if (!currentTask && !taskCompleted) {
            const task = prompt("What is your task for this website?");
            if (task) {
                let timeSelection = null;
                while (!timeSelection) {
                    timeSelection = prompt("How long would this task take to complete?\nEnter 5, 10, or 30 minutes:");
                
                    if (!["5", "10", "30"].includes(timeSelection)) {
                        alert("Please enter a valid option: 5, 10, or 30 minutes");
                        timeSelection = null;
                    }
                }
                
                const timeInMinutes = parseInt(timeSelection, 10);
                
                currentTask = task;
                displayTask(task, timeInMinutes);

                chrome.runtime.sendMessage({ 
                    action: "saveTask", 
                    url: currentURL, 
                    task: task,
                    timeInMinutes: timeInMinutes
                });
            }
        }
    }
}

// Load target websites when the script runs
loadTargetWebsites();

// Check storage for this URL's task
chrome.runtime.sendMessage({action: "getTask", url: window.location.href}, (response) => {
    if (response?.task) {
        currentTask = response.task; // Store the task locally
        displayTask(response.task, response.timeInMinutes);
    }
});

// Listen for messages from the popup or background
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "displayTask") {
        currentTask = message.task; // Update the local task
        displayTask(message.task);
    } else if (message.action === "websiteListUpdated") {
        // Update the website list when it's changed in the popup
        if (message.websites && Array.isArray(message.websites)) {
            targetWebsites = message.websites;
            // We don't want to prompt again immediately after the list is updated
            // checkCurrentUrlForPrompt();
        }
    }
});

// Intercept page closing
window.addEventListener('beforeunload', (e) => {
    if (currentTask && !allowClose && !taskCompleted) {
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