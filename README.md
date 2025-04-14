# Linux Challenge Terminal – LeaningTech Hackathon 2025

An interactive web-based Linux learning environment powered by **CheerpX**, **xterm.js**, and **Claude AI**. This project brings a full Linux terminal experience right to your browser, offering real-time challenges with intelligent guidance and code execution.

![Screenshot](https://user-images.githubusercontent.com/placeholder/screenshot.png)  
*Replace the URL above with your actual screenshot image URL if available.*

---

## 🚀 Features

- **Interactive Linux Terminal:** Run a full Linux shell directly in your browser.
- **Claude AI Assistance:** Get real-time code guidance and bash command execution via Anthropic's Claude API.
- **Prebuilt Challenges:** Tackle engaging challenges to strengthen your Linux skills.
- **xterm.js Integration:** Experience a fast, customizable terminal emulator.
- **Persistent Environment:** Enjoy state persistence using browser-side IDB and overlay filesystem.

---



## 📦 Tech Stack

| Technology      | Usage                                                 |
|-----------------|-------------------------------------------------------|
| **Next.js**     | React framework for building the web app              |
| **CheerpX**     | Virtualized Linux environment in the browser          |
| **xterm.js**    | Terminal emulator for a real Linux terminal feel      |
| **Claude API**  | AI-driven assistant for executing bash commands       |
| **Tailwind CSS**| Styling and responsive design                         |

---

## 🎮 How It Works

1. **Select a Challenge:** Choose a Linux challenge from the homepage.
2. **Interactive Workspace:** The screen is split into two sections:
   - **Left Panel:** Displays challenge instructions, a code editor with starter code, and an input for Claude AI.
   - **Right Panel:** Runs a live Linux terminal and shows Claude’s responses.
3. **Run Commands & Learn:** Execute commands, interact with Claude for explanations, and reset the terminal whenever needed.

---

## 🔐 Claude API Setup

To enable real-time AI interactions, you need an API key from Anthropic:

1. **Obtain Your API Key:**  
   Register on [Anthropic's website](https://www.anthropic.com/) to get your API key.

2. **Set Your API Key:**  
   Either paste it into your browser when prompted or directly update the code:
   ```js
   localStorage.setItem("anthropic-api-key", "your-key-here");
---
## 🛠 Local Setup & Running the Project

Follow these instructions to run the project locally:

```bash
# Clone the repository
git clone https://github.com/your-username/linux-terminal-hackathon.git

# Navigate into the project directory
cd linux-terminal

# Install dependencies
npm install

# Start the development server
npm run dev



