# 🚀 Project Name : DorkVault


### DorkVault : Chrome Extension to save, manage, and organize your Google dork search history with intelligent auto-detection and advanced filtering capabilities.

 
![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-pink.svg)
<a href="https://github.com/gigachad80/DorkVault/issues"><img src="https://img.shields.io/badge/contributions-welcome-purple.svg?style=flat"></a>

### Table of Contents

* [📌 Overview](#-overview)
* [✨ Features](#-features)
* [📚 Requirements & Dependencies](#-requirements--dependencies)
* [📥 Installation Guide](#-installation-guide)
* [🚀 Usage](#-usage)
  - [Basic Usage](#basic-usage)
* [🤔 Why This Name?](#-why-this-name)
* [⌚ Development Time](#-development-time)
* [🙃 Why I Created This](#-why-i-created-this)
* [💖 Credits ](###-credits)
* [📞 Contact](#-contact)
* [📄 License](#-license)

### 📌 Overview

**DorkVault** is a Chrome extension designed for security researchers, penetration testers, and OSINT practitioners to efficiently save, manage, and organize their Google dork search history. It provides intelligent auto-detection, advanced filtering, and seamless integration with Google search for optimal productivity.

**Key Capabilities:**
* Automatic dork detection on Google search pages
* Advanced search and filtering by tags and content
* One-click Google search integration
* Smart usage tracking and statistics
* Beautiful glassmorphism UI design
* Secure local storage with Chrome sync

### ✨ Features

### 🎯 Smart Dork Management
- **Manual Dork Saving** - Add dorks through the popup interface with custom tags
- **Auto-Detection Magic** - Automatically detects when you're using Google dorks and offers to save them
- **Tag-Based Organization** - Organize dorks with custom tags for easy categorization
- **Usage Tracking** - Tracks how often you use each dork with timestamps
- **No Duplicates** - Prevents saving duplicate dorks automatically

### ⚡ Advanced Search & Filtering
- **Real-Time Search** - Instantly filter dorks by text content or tags as you type
- **Search Highlighting** - Visual highlighting of matching search terms
- **Smart Filtering** - Search works across both dork text and associated tags
- **Clear Search** - Easy one-click search reset functionality

### 🔍 Auto-Detection Intelligence
- **30+ Dork Operators** - Recognizes site:, filetype:, intitle:, inurl:, intext:, and many more
- **Boolean Logic Detection** - Detects AND/OR operators combined with dork syntax
- **Complex Pattern Recognition** - Identifies quotes, wildcards, minus operators, and parentheses
- **Floating Save Button** - Non-intrusive save prompt appears on Google results pages
- **Smart Timing** - Auto-hides after 10 seconds if not used

### 🚀 Seamless Integration
- **One-Click Search** - Click any saved dork to instantly open Google search in new tab
- **Copy to Clipboard** - Quick copy functionality with toast notifications
- **Context Menu** - Right-click any selected text to save as dork
- **Chrome Sync** - Dorks sync across all your Chrome browsers
- **Fallback Support** - Works even if extension APIs are unavailable

### 🎨 Beautiful User Interface
- **Modern Glassmorphism Design** - Elegant gradient backgrounds with backdrop blur
- **Responsive Layout** - Clean, organized interface that scales beautifully
- **Toast Notifications** - Smooth animations for user feedback
- **Dark Theme Optimized** - Eye-friendly colors for extended usage
- **Intuitive Controls** - User-friendly buttons and clear visual hierarchy

### 📚 Requirements & Dependencies

* **Chrome Browser** - Version 88+ (Manifest V3 support)
* **Developer Mode** - Required for installation from source


### 📥 Installation Guide

### ⚡ Quick Install


```bash
git clone https://github.com/gigachad80/DorkVault
cd DorkVault
```

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `DorkVault` folder
5. The extension should now appear in your extensions list



### 🚀 Usage

### Basic Usage

```bash
# Save dorks manually through popup
1. Click the DorkVault extension icon
2. Enter your dork in the input field
3. Add tags (comma-separated)
4. Click "Save"

# Auto-detection on Google
1. Search on Google: site:github.com filetype:py "password"
2. Notice the floating "💾 Save this dork" button on right side.
3. You will always see the button whenever you use common dork operators like inurl , intext site etc..
4. Click to save automatically with "auto-detected" tag

# Search your saved dorks
1. Open DorkVault popup
2. Use the search bar to filter by text or tags
3. Click "Search" on any dork to open in new tab
4. Click "Copy" to copy dork to clipboard

# Organize with tags
Examples: criminal, security, recon, admin, files, credentials, osint etc.
```

### Example Dorks by Category:

**🔒 Security Research**
```
site:*.edu filetype:pdf "vulnerability assessment"
intitle:"index of" "config.php"
inurl:admin site:government.* -site:www.*
```

**📁 File Discovery**
```
filetype:sql "password" OR "passwd"
ext:log "error" OR "exception"
site:pastebin.com "api_key" OR "secret"
```

**🕵️ OSINT Research**
```
site:linkedin.com "security engineer" location:"new york"
intext:"@company.com" filetype:pdf
"powered by" inurl:admin site:target.com
```

### 🤔 Why This Name?

**DorkVault** represents a secure vault where all your valuable Google dorks are stored, organized, and easily accessible. Like a bank vault protects treasures, DorkVault protects your hard-earned dork collection! 🏦💎


### ⌚ Development Time

1 hr 9 min

### 🙃 Why I Created This

Actually, whenever I do OSINT, especially when it's on a person for cybercrime purposes, I end up using so many dorks that I keep forgetting them, and the browser history gets filled with 70-80 different dorks ( ofc, using different operators and different types of available data). So, I decided to create my own DorkSaver, because I couldn’t find any Chrome extension like that. And I can’t really manage it through the terminal or a notes app, because I’d have to keep switching screens again and again — whereas if I use a browser extension, it becomes much more efficient.
 

### 💖 Credits 

> [!WARNING]
> I've  vibe coded the whole extension except logo and UI design . Thanks to Claude 4 Sonnet 

### 📞 Contact

📧 Email: **pookielinuxuser@tutamailcom**


---

### 📄 License

Licensed under the **Apache 2.0 License**.  
See [`LICENSE.md`](https://github.com/gigachad80/DorkVault/blob/main/LICENSE.md) for details.

First Published : 18th September 2025

Last Updated : 18th September 2025

---

**Made with ❤️ for the InfoSec Community** - Fast, intelligent, and secure dork management.

---

