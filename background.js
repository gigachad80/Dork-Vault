// Background script for the Dork History Manager extension
class DorkBackgroundManager {
    constructor() {
        this.init();
    }

    init() {
        // Listen for messages from content script
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
        });

        // Set up context menu
        this.setupContextMenu();

        // Listen for extension installation
        chrome.runtime.onInstalled.addListener(() => {
            this.onInstalled();
        });
    }

    handleMessage(message, sender, sendResponse) {
        switch (message.type) {
            case 'DORK_SAVED':
                this.handleDorkSaved(message.dork);
                break;
            case 'GET_CURRENT_TAB_URL':
                this.getCurrentTabUrl(sendResponse);
                return true; // Keep message channel open for async response
        }
    }

    handleDorkSaved(dork) {
        // Show notification when a dork is automatically saved
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Dork Saved!',
            message: `Automatically saved: ${dork.text.substring(0, 50)}${dork.text.length > 50 ? '...' : ''}`
        });
    }

    setupContextMenu() {
        // Create context menu item for selected text
        chrome.contextMenus.create({
            id: 'saveDork',
            title: 'Save as Dork',
            contexts: ['selection']
        });

        chrome.contextMenus.onClicked.addListener((info, tab) => {
            if (info.menuItemId === 'saveDork') {
                this.saveSelectedTextAsDork(info.selectionText);
            }
        });
    }

    async saveSelectedTextAsDork(selectedText) {
        if (!selectedText) return;

        const result = await chrome.storage.sync.get(['savedDorks']);
        const savedDorks = result.savedDorks || [];

        // Check for duplicates
        const isDuplicate = savedDorks.some(dork => dork.text === selectedText);
        if (isDuplicate) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Dork Already Exists',
                message: 'This dork is already in your collection.'
            });
            return;
        }

        const newDork = {
            id: Date.now(),
            text: selectedText,
            tags: ['context-menu'],
            createdAt: new Date().toISOString(),
            usageCount: 0,
            source: 'context-menu'
        };

        savedDorks.unshift(newDork);
        await chrome.storage.sync.set({ savedDorks });

        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Dork Saved!',
            message: `Saved: ${selectedText.substring(0, 50)}${selectedText.length > 50 ? '...' : ''}`
        });
    }

    getCurrentTabUrl(sendResponse) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                sendResponse({ url: tabs[0].url });
            }
        });
    }

    onInstalled() {
        // Initialize storage with default values if needed
        chrome.storage.sync.get(['savedDorks'], (result) => {
            if (!result.savedDorks) {
                chrome.storage.sync.set({
                    savedDorks: [],
                    settings: {
                        autoDetect: true,
                        showNotifications: true
                    }
                });
            }
        });

        // Show welcome notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Dork History Manager Installed!',
            message: 'Start saving your Google dorks for easy reuse. Click the extension icon to get started.'
        });
    }
}

// Initialize the background manager
new DorkBackgroundManager();
