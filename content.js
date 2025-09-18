// Content script to detect and suggest saving dorks from Google search
class DorkDetector {
    constructor() {
        this.init();
    }

    init() {
        // Check if current URL is a Google search
        if (this.isGoogleSearch()) {
            this.detectDorks();
        }
    }

    isGoogleSearch() {
        return window.location.hostname.includes('google.com') &&
            window.location.pathname === '/search';
    }

    detectDorks() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');

        if (query && this.isDork(query)) {
            this.showSaveButton(query);
        }
    }

    isDork(query) {
        // Enhanced dork operators list
        const dorkOperators = [
            'site:', 'filetype:', 'intitle:', 'inurl:', 'intext:',
            'allintext:', 'allintitle:', 'allinurl:', 'link:',
            'cache:', 'related:', 'info:', 'ext:', 'inanchor:',
            'allinanchor:', 'author:', 'group:', 'stocks:',
            'define:', 'phonebook:', 'movie:', 'weather:',
            'map:', 'book:', 'froogle:', 'daterange:',
            // New operators
            'source:', 'before:', 'after:', 'around(', 'loc:',
            'location:', 'blogurl:', 'bphonebook:', 'rphonebook:',
            'safesearch:', 'numrange:', 'ip:', 'range:'
        ];

        // Enhanced pattern detection
        const hasDorkOperators = dorkOperators.some(op => query.toLowerCase().includes(op));
        const hasQuotesWithOperators = /["'][^"']*["']/.test(query) && dorkOperators.some(op => query.toLowerCase().includes(op));
        const hasMinusOperator = /-\w+/.test(query);
        const hasBooleanOperators = /\s(AND|OR)\s/i.test(query);
        const hasWildcards = /\*/.test(query) && query.length > 3; // Avoid saving just "*"
        const hasParenthesesGrouping = /\([^)]+\)/.test(query) && query.includes(':');
        const hasNumericRanges = /\d+\.\.\d+/.test(query);

        return hasDorkOperators || hasQuotesWithOperators || hasMinusOperator ||
            (hasBooleanOperators && query.includes(':')) || hasWildcards ||
            hasParenthesesGrouping || hasNumericRanges;
    }

    async showSaveButton(query) {
        // Check if already saved
        const result = await chrome.storage.sync.get(['savedDorks']);
        const savedDorks = result.savedDorks || [];
        const isAlreadySaved = savedDorks.some(dork => dork.text === query);

        if (isAlreadySaved) return;

        // Create save button
        const saveButton = document.createElement('div');
        saveButton.id = 'dork-save-button';
        saveButton.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 20px;
                border-radius: 25px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                cursor: pointer;
                font-family: 'Segoe UI', sans-serif;
                font-size: 14px;
                font-weight: 600;
                z-index: 10000;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
            ">
                💾 Save this dork
            </div>
        `;

        // Add hover effects
        const button = saveButton.firstElementChild;
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });

        button.addEventListener('click', async () => {
            await this.saveDork(query);
            button.innerHTML = '✅ Saved!';
            button.style.background = '#4CAF50';

            setTimeout(() => {
                saveButton.remove();
            }, 2000);
        });

        document.body.appendChild(saveButton);

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (saveButton.parentNode) {
                saveButton.remove();
            }
        }, 10000);
    }

    async saveDork(query) {
        const result = await chrome.storage.sync.get(['savedDorks']);
        const savedDorks = result.savedDorks || [];

        const newDork = {
            id: Date.now(),
            text: query,
            tags: ['auto-detected'],
            createdAt: new Date().toISOString(),
            usageCount: 1,
            source: 'auto-detected'
        };

        savedDorks.unshift(newDork);
        await chrome.storage.sync.set({ savedDorks });

        // Send message to background script
        chrome.runtime.sendMessage({
            type: 'DORK_SAVED',
            dork: newDork
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DorkDetector();
    });
} else {
    new DorkDetector();
}
