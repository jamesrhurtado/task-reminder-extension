chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTask") {
        chrome.storage.sync.get([request.url], (result) => {
            sendResponse({task: result[request.url]});
        });
        return true; // Required for async response
    }
    if (request.action === "saveTask") {
        chrome.storage.sync.set({ [request.url]: request.task }, () => {
            if (chrome.runtime.lastError) {
                console.error("Error saving task:", chrome.runtime.lastError);
            }
        });
    }
});