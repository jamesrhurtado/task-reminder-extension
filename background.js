chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTask") {
        chrome.storage.sync.get([request.url], (result) => {
            if (result[request.url]) {
                const taskData = result[request.url];
                if (typeof taskData === 'string') {
                    sendResponse({task: taskData});
                } else {
                    sendResponse({
                        task: taskData.task,
                        timeInMinutes: taskData.timeInMinutes
                    });
                }
            } else {
                sendResponse({task: null});
            }
        });
        return true;
    }
    if (request.action === "saveTask") {
        const taskData = {
            task: request.task,
            timeInMinutes: request.timeInMinutes
        };
        
        chrome.storage.sync.set({ [request.url]: taskData }, () => {
            if (chrome.runtime.lastError) {
                console.error("Error saving task:", chrome.runtime.lastError);
            }
        });
    }
});


chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get('targetWebsites', (result) => {
        if (!result.targetWebsites) {
            const defaultWebsites = ["facebook.com", "instagram.com"];
            chrome.storage.sync.set({ 'targetWebsites': defaultWebsites }, () => {
                console.log('Default target websites initialized');
            });
        }
    });
});