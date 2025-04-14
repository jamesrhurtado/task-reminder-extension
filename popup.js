document.getElementById('saveTask').addEventListener('click', () => {
    const taskNote = document.getElementById('taskNote').value.trim();
    if (!taskNote) {
        alert('Task note cannot be empty.');
        return;
    }
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const url = tabs[0]?.url;
        if (!url) {
            console.error('Unable to retrieve the active tab URL.');
            return;
        }
        chrome.storage.sync.set({[url]: taskNote}, () => {
            if (chrome.runtime.lastError) {
                console.error('Error saving task:', chrome.runtime.lastError);
                alert('Failed to save the task. Please try again.');
            } else {
                console.log('Task saved for this website');
                chrome.tabs.sendMessage(tabs[0].id, {action: "displayTask", task: taskNote});
                window.close();
            }
        });
    });
});