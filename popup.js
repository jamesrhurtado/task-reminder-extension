
let targetWebsites = [];

document.addEventListener('DOMContentLoaded', () => {
    loadWebsites();
});

function loadWebsites() {
    chrome.storage.sync.get('targetWebsites', (result) => {
        if (result.targetWebsites) {
            targetWebsites = result.targetWebsites;
        } else {
            targetWebsites = ["facebook.com", "instagram.com"];
            saveWebsites();
        }
        displayWebsiteList();
    });
}


function saveWebsites() {
    chrome.storage.sync.set({ 'targetWebsites': targetWebsites }, () => {
        if (chrome.runtime.lastError) {
            console.error('Error saving websites:', chrome.runtime.lastError);
        } else {
            console.log('Websites saved successfully');
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, { 
                        action: "websiteListUpdated", 
                        websites: targetWebsites 
                    }).catch(() => {

                    });
                });
            });
        }
    });
}

function displayWebsiteList() {
    const websiteList = document.getElementById('websiteList');
    websiteList.innerHTML = '';

    if (targetWebsites.length === 0) {
        websiteList.innerHTML = '<li>No websites added yet</li>';
        return;
    }

    targetWebsites.forEach((website, index) => {
        const li = document.createElement('li');
        li.textContent = website;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-website';
        removeButton.addEventListener('click', () => removeWebsite(index));

        li.appendChild(removeButton);
        websiteList.appendChild(li);
    });
}

document.getElementById('addWebsite').addEventListener('click', () => {
    const newWebsite = document.getElementById('newWebsite').value.trim();
    if (!newWebsite) {
        alert('Please enter a website URL.');
        return;
    }

    if (targetWebsites.includes(newWebsite)) {
        alert('This website is already in the list.');
        return;
    }

    targetWebsites.push(newWebsite);
    saveWebsites();
    displayWebsiteList();
    document.getElementById('newWebsite').value = '';
});

function removeWebsite(index) {
    targetWebsites.splice(index, 1);
    saveWebsites();
    displayWebsiteList();
}