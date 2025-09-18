class DorkManager {
    constructor() {
        this.dorks = [];
        this.filteredDorks = [];
        this.init();
    }

    async init() {
        await this.loadDorks();
        this.bindEvents();
        this.renderDorks();
        this.updateStats();
    }

    async loadDorks() {
        const result = await chrome.storage.sync.get(['savedDorks']);
        this.dorks = result.savedDorks || [];
        this.filteredDorks = [...this.dorks];
    }

    async saveDorks() {
        await chrome.storage.sync.set({ savedDorks: this.dorks });
    }

    bindEvents() {
        document.getElementById('saveDork').addEventListener('click', () => this.saveDork());
        document.getElementById('dorkInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveDork();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => this.searchDorks(e.target.value));
        document.getElementById('clearSearch').addEventListener('click', () => this.clearSearch());

        // Use event delegation for dynamic buttons instead of global functions
        document.getElementById('dorksList').addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const dorkItem = button.closest('.dork-item');
            if (!dorkItem) return;

            const dorkId = parseInt(button.dataset.dorkId);
            const dorkText = button.dataset.dorkText;

            if (button.classList.contains('btn-search')) {
                this.searchDork(dorkText, dorkId);
            } else if (button.classList.contains('btn-copy')) {
                this.copyDork(dorkText);
            } else if (button.classList.contains('btn-delete')) {
                this.deleteDork(dorkId);
            }
        });
    }

    searchDorks(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredDorks = [...this.dorks];
        } else {
            const term = searchTerm.toLowerCase();
            this.filteredDorks = this.dorks.filter(dork => {
                const textMatch = dork.text.toLowerCase().includes(term);
                const tagMatch = dork.tags.some(tag => tag.toLowerCase().includes(term));
                return textMatch || tagMatch;
            });
        }
        this.renderDorks();
        this.updateStats();
    }

    clearSearch() {
        document.getElementById('searchInput').value = '';
        this.filteredDorks = [...this.dorks];
        this.renderDorks();
        this.updateStats();
    }

    async saveDork() {
        const dorkInput = document.getElementById('dorkInput');
        const tagInput = document.getElementById('tagInput');
        const dorkText = dorkInput.value.trim();

        if (!dorkText) return;

        const tags = tagInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);

        const newDork = {
            id: Date.now(),
            text: dorkText,
            tags: tags,
            createdAt: new Date().toISOString(),
            usageCount: 0
        };

        // Check for duplicates
        const isDuplicate = this.dorks.some(dork => dork.text === dorkText);
        if (isDuplicate) {
            this.showToast('This dork is already saved!', 'error');
            return;
        }

        this.dorks.unshift(newDork);
        this.filteredDorks = [...this.dorks];
        await this.saveDorks();

        dorkInput.value = '';
        tagInput.value = '';

        this.renderDorks();
        this.updateStats();
        this.showToast('Dork saved successfully!');
    }

    async deleteDork(id) {
        if (confirm('Are you sure you want to delete this dork?')) {
            this.dorks = this.dorks.filter(dork => dork.id !== id);
            this.filteredDorks = this.filteredDorks.filter(dork => dork.id !== id);
            await this.saveDorks();
            this.renderDorks();
            this.updateStats();
            this.showToast('Dork deleted successfully!');
        }
    }

    async searchDork(dorkText, id) {
        console.log('Searching dork:', dorkText, 'ID:', id); // Debug log

        try {
            // Increment usage count
            const dorkIndex = this.dorks.findIndex(d => d.id === id);
            if (dorkIndex !== -1) {
                this.dorks[dorkIndex].usageCount++;
                this.dorks[dorkIndex].lastUsed = new Date().toISOString();
                await this.saveDorks();
                this.renderDorks();
                this.updateStats();
            }

            // Try to open Google search with the dork
            const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(dorkText);

            // Check if we're in an extension context
            if (typeof chrome !== 'undefined' && chrome.tabs) {
                await chrome.tabs.create({ url: searchUrl });
                this.showToast('Opened search in new tab!');
            } else {
                // Fallback for non-extension context
                window.open(searchUrl, '_blank');
                this.showToast('Opened search in new window!');
            }
        } catch (error) {
            console.error('Error opening search:', error);
            // Final fallback: copy to clipboard
            await this.copyDork(dorkText);
            this.showToast('Copied dork to clipboard (couldn\'t open tab)', 'error');
        }
    }

    async copyDork(dorkText) {
        console.log('Copying dork:', dorkText); // Debug log

        try {
            await navigator.clipboard.writeText(dorkText);
            this.showToast('Dork copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy:', error);

            // Fallback method using textarea
            try {
                const textarea = document.createElement('textarea');
                textarea.value = dorkText;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                this.showToast('Dork copied to clipboard!');
            } catch (fallbackError) {
                console.error('Fallback copy failed:', fallbackError);
                this.showToast('Failed to copy dork', 'error');
            }
        }
    }

    async deleteDork(id) {
        console.log('Deleting dork ID:', id); // Debug log

        if (confirm('Are you sure you want to delete this dork?')) {
            this.dorks = this.dorks.filter(dork => dork.id !== id);
            this.filteredDorks = this.filteredDorks.filter(dork => dork.id !== id);
            await this.saveDorks();
            this.renderDorks();
            this.updateStats();
            this.showToast('Dork deleted successfully!');
        }
    }

    showToast(message, type = 'success') {
        // Remove existing toast if any
        const existingToast = document.getElementById('toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast notification
        const toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.position = 'fixed';
        toast.style.top = '10px';
        toast.style.right = '10px';
        toast.style.background = type === 'success' ? '#4CAF50' : '#f44336';
        toast.style.color = 'white';
        toast.style.padding = '8px 16px';
        toast.style.borderRadius = '20px';
        toast.style.fontSize = '12px';
        toast.style.fontWeight = '600';
        toast.style.zIndex = '10001';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        toast.textContent = message;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 2 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 2000);
    }

    renderDorks() {
        const dorksList = document.getElementById('dorksList');
        const searchTerm = document.getElementById('searchInput').value;

        if (this.filteredDorks.length === 0) {
            if (this.dorks.length === 0) {
                dorksList.innerHTML = '<div class="empty-state">No dorks saved yet. Start by saving your first dork!</div>';
            } else {
                dorksList.innerHTML = '<div class="empty-state">No dorks match your search. Try a different search term.</div>';
            }
            return;
        }

        const dorksHtml = this.filteredDorks.map(dork => {
            const escapedText = this.escapeHtml(dork.text);
            const highlightedText = this.highlightSearchTerm(escapedText, searchTerm);

            const tagsHtml = dork.tags.map(tag => {
                const escapedTag = this.escapeHtml(tag);
                const highlightedTag = this.highlightSearchTerm(escapedTag, searchTerm);
                return '<span class="tag">' + highlightedTag + '</span>';
            }).join('');

            return `
                <div class="dork-item">
                    <div class="dork-text">${highlightedText}</div>
                    <div class="dork-meta">
                        <div>
                            <span>${new Date(dork.createdAt).toLocaleDateString()}</span>
                            ${dork.usageCount > 0 ? '<span> • Used ' + dork.usageCount + ' times</span>' : ''}
                            <div>${tagsHtml}</div>
                        </div>
                        <div class="dork-actions">
                            <button class="btn-search" data-dork-text="${this.escapeHtml(dork.text)}" data-dork-id="${dork.id}">Search</button>
                            <button class="btn-copy" data-dork-text="${this.escapeHtml(dork.text)}" data-dork-id="${dork.id}">Copy</button>
                            <button class="btn-delete" data-dork-id="${dork.id}">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        dorksList.innerHTML = dorksHtml;
    }

    highlightSearchTerm(text, searchTerm) {
        if (!searchTerm) return text;

        const regex = new RegExp('(' + this.escapeRegex(searchTerm) + ')', 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    updateStats() {
        const count = this.filteredDorks.length;
        const total = this.dorks.length;
        const countElement = document.getElementById('dorkCount');

        if (count === total) {
            countElement.textContent = count + ' saved dork' + (count !== 1 ? 's' : '');
        } else {
            countElement.textContent = count + ' of ' + total + ' dork' + (total !== 1 ? 's' : '');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeForJs(text) {
        return text
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
    }
}

// Initialize the dork manager when popup loads
const dorkManager = new DorkManager();
