# 🪷 MindEase AI – Guided Meditations and ASMR
### *An AI-Assisted Digital Wellness & Stress-Reduction Web Platform*
**College Mini Project in Web Engineering & Human-Computer Interaction**

![MindEase AI Nature Background](assets/images/peaceful_nature_bg.jpg)

---

## 📖 1. Project Overview

**MindEase AI** is an aesthetically crafted, beginner-friendly, and accessible web application designed to help students and professionals manage everyday academic fatigue, stress, and anxiety. It combines:
- **Visual Breathing Biofeedback:** Interactive pulsing breathing circle supporting Box Breathing, 4-7-8, Deep Heart Rhythm, and Awakening rhythms.
- **Web Speech API Voice Narration:** Spoken meditation cues read aloud in real time using the browser's native text-to-speech engine.
- **Procedural ASMR Soundscapes:** Built-in organic sound generators (Rainfall, Ocean Waves, Forest, Mountain Wind, 432Hz Tibetan Singing Bowl, and Cozy Campfire) powered by the **HTML5 Web Audio API**—guaranteeing 100% offline reliability with zero broken links.
- **AI-Driven Mood Recommendations:** Contextual recommendations providing tailored breathwork and sound pairings based on user-selected emotional states.
- **AI Mindfulness Companion:** An intelligent conversational chatbot featuring an offline rule-based mindfulness engine and optional Google Gemini API integration.
- **Aesthetic Glassmorphic Authentication:** Relaxing login and registration modal with show/hide password toggle, input validation, and a **1-click Quick Demo Mode**.
- **Progress & Habits Dashboard:** Comprehensive session history, mindfulness streaks, and milestone badges stored persistently in client-side **LocalStorage**, with a one-click text report export.

---

## 🛠️ 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Structure** | HTML5 Semantic Elements | Accessible, SEO-friendly layout (`<header>`, `<nav>`, `<main>`, `<section>`, `<dialog>`) |
| **Styling** | Vanilla CSS3 | Ultra-modern glassmorphism (`backdrop-filter`), keyframe animations, responsive grid/flexbox |
| **Logic** | Vanilla JavaScript (ES6+) | Modular architecture (`AuthManager`, `MoodEngine`, `MeditationPlayer`, `SoundscapeMixer`, etc.) |
| **Voice Synthesis** | Web Speech API | Browser-native Text-to-Speech (`window.speechSynthesis`) for guided meditation instructions |
| **Sound Synthesis** | Web Audio API | Zero-dependency procedural pink/white noise filtering, LFO modulation, and sine oscillators |
| **Storage** | Web Storage API (LocalStorage) | Secure client-side persistence for user credentials, active session, history, and streaks |
| **Generative AI** | Google Gemini API (Optional) | Optional generative intelligence with built-in offline mindfulness fallback |
| **Local Server** | Node.js Built-in HTTP | Zero-dependency static development server (`node server.js`) |

---

## 📂 3. Project Directory Structure

```text
Mind easy ai/
│
├── index.html                  # Main Single-Page Web Application
├── style.css                   # Glassmorphic CSS Design System & Keyframe Animations
├── script.js                   # Core Application Modules & Web Audio Synthesizer
├── server.js                   # Zero-dependency local Node.js development server
├── README.md                   # Setup guide and usage instructions
├── PROJECT_DOCUMENTATION.md    # Complete College Mini Project Report (DFDs, UML, Test Cases)
│
└── assets/
    ├── images/
    │   └── peaceful_nature_bg.jpg   # Ultra-high-resolution peaceful nature background
    └── sounds/
        └── README.md                # Guide on procedural audio & adding custom MP3 files
```

---

## 🚀 4. Step-by-Step Installation & Running Guide

You can run MindEase AI in less than 30 seconds using either **Node.js** or **VS Code Live Server**.

### Method A: Running with Built-in Node.js Server (Recommended)
1. Open your terminal (PowerShell, Command Prompt, or Terminal) in the project directory:
   ```bash
   cd "Mind easy ai"
   ```
2. Start the lightweight local server:
   ```bash
   node server.js
   ```
3. Open your browser and visit:
   ```text
   http://localhost:3000
   ```

---

### Method B: Running with VS Code Live Server Extension
1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Open VS Code, press `Ctrl + Shift + X` (or `Cmd + Shift + X` on Mac), search for **Live Server** (by *Ritwick Dey*), and click **Install**.
3. Open the `Mind easy ai` folder in VS Code (`File > Open Folder...`).
4. Right-click on `index.html` in the file explorer and select **"Open with Live Server"**.
5. The application will launch automatically in your default browser at `http://127.0.0.1:5500/index.html`.

---

### Method C: Direct Browser Opening (No Server Needed)
Because all audio synthesis, voice narration, and storage are 100% client-side, you can even double-click `index.html` directly to open it in Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari!

---

## 🧪 5. How to Test Each Feature

### 1. Test Authentication & Demo Mode
- Click the **"Sign In / Demo"** button in the top navigation bar.
- Notice the soothing glassmorphism modal with glowing lotus branding.
- Switch between the **"Sign In"** and **"Create Account"** tabs.
- Click the **"✨ Quick Demo Mode"** button to log in instantly as **"Zen Explorer"** without typing.
- Observe your user badge in the header with a working **Logout** button.

### 2. Test AI Mood Recommendations
- Scroll to the **"Choose Your Mood"** section.
- Click **"Stressed"**, **"Anxious"**, **"Sad"**, **"Tired"**, or **"Happy"**.
- Notice how the recommendation card dynamically calculates the scientific rationale, recommended duration (e.g. 5 minutes), breathing pattern (e.g. 4-7-8 for Anxiety), and matching ASMR soundscape.
- Click **"Start This Session"**: The app smoothly scrolls to the Meditation section and pre-loads the settings.

### 3. Test Guided Meditation & Voice Guidance
- Select **2 Min**, **5 Min**, or **10 Min**.
- Select a technique (e.g. *Box Breathing 4-4-4-4* or *4-7-8 Breathing*).
- Click **"Start Session"**:
  - The breathing circle expands on **Inhale**, pulses on **Hold**, and contracts on **Exhale**.
  - Browser Text-to-Speech speaks: *"Welcome to your MindEase session..."* followed by phase instructions.
  - The SVG circular progress ring updates clockwise as time elapses.
- Test the **"Pause"**, **"Resume"**, and **"Stop / Reset"** buttons.
- Toggle the **"🗣️ Voice On / Voice Off"** pill button anytime to mute or unmute speech.

### 4. Test ASMR Soundscape Mixer
- Scroll to the **"ASMR Soundscape Mixer"** section.
- Click **"Play"** on **Rainfall**: Notice the animated sound wave visualizer bars dance and the active toolbar updates.
- Click **"Play"** on **Tibetan Singing Bowl**: Notice both sounds play simultaneously, allowing custom sound layering!
- Adjust the individual volume sliders and the master volume slider.
- Click **"Stop All Sounds"** to mute all active ambiences.

### 5. Test AI Mindfulness Companion
- Scroll to the **"AI Mindfulness Companion"** section.
- Click one of the quick prompt chips (e.g. `📚 Overwhelmed with exams`).
- Notice the typing indicator dots appear, followed by a compassionate, structured mindfulness reflection.
- Type your own message (e.g., *"How do I stop overthinking before bed?"*) and click **Send**.

### 6. Test Optional Google Gemini API
- In the chatbot header, click the **Settings gear icon (⚙️)**.
- Paste a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) and click **"Save Key"**.
- Your chatbot will now generate real-time generative responses via Gemini!
- If no key is entered or if offline, the built-in mindfulness engine works seamlessly.

### 7. Test Progress Tracker & Export
- Complete a session or wait for the timer to log your mindfulness time.
- View **Total Minutes**, **Completed Sessions**, and **Streak**.
- Check the **Unlocked Badges** milestone icons.
- Click **"Export Report"** to download `MindEase_Report_[Date].txt` for your project demo.
- Test the **"Reset History"** button to reset progress.

---

## 🎨 6. Replacing Background & Audio Assets

### Customizing the Background
- Replace `assets/images/peaceful_nature_bg.jpg` with any 1920x1080 JPEG or PNG image of your choice.
- The CSS handles responsive scaling and the dark contrast gradient automatically.

### Adding Your Own MP3 Sounds
- See instructions in [assets/sounds/README.md](assets/sounds/README.md).
- Drop `rain.mp3`, `ocean.mp3`, `forest.mp3`, `wind.mp3`, `bowl.mp3`, or `fire.mp3` into `assets/sounds/`.

---

## 📋 7. College Submission Checklist

- [x] Full source code provided (`index.html`, `style.css`, `script.js`, `server.js`).
- [x] Zero external node package installation required.
- [x] Interactive breathing animation circle with synchronized countdown timer.
- [x] Native Web Speech API text-to-speech narration with mute/unmute control.
- [x] 6-track Web Audio API ASMR procedural soundscape synthesizer.
- [x] AI Mood-adaptive recommendation engine.
- [x] Interactive mindfulness chatbot with offline mode & optional Gemini API.
- [x] Glassmorphism Login and Signup modal with 1-click Quick Demo Mode.
- [x] Persistent LocalStorage progress tracker with streak and badges.
- [x] Downloadable text report export feature.
- [x] Academic documentation report (`PROJECT_DOCUMENTATION.md`) including DFD, UML, and test cases.

---

## ⚖️ 8. License & Ethical Disclaimer

**MindEase AI** is an open-source educational project developed for academic evaluation. 

**Mindfulness & Health Disclaimer:** Mood selection and suggestions provided by MindEase AI are self-reported and intended solely for stress reduction and personal mindfulness. MindEase AI does not diagnose, treat, or replace professional psychiatric or medical therapy.
