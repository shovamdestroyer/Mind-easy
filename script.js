/**
 * MindEase AI – Guided Meditations & ASMR
 * Core Client-Side Application Script
 * 
 * Features:
 * 1. Authentication & LocalStorage Session Management (with Quick Demo Mode)
 * 2. AI Mood Recommendation Engine
 * 3. Guided Meditation & Breathing Player (Web Speech API + Visual Ring)
 * 4. Procedural ASMR Soundscape Synthesizer & Audio Mixer (Web Audio API)
 * 5. AI Mindfulness Assistant (Built-in offline engine + optional Gemini API)
 * 6. User Progress, Badges & Session Analytics (LocalStorage)
 * 7. Ambient Particle Canvas Animation
 */

'use strict';

/* ==========================================================================
   MODULE 1: DATA PERSISTENCE & LOCALSTORAGE KEYS
   ========================================================================== */
const STORAGE_KEYS = {
  USERS: 'mindease_registered_users',
  ACTIVE_USER: 'mindease_active_user',
  PROGRESS: 'mindease_user_progress',
  SETTINGS: 'mindease_app_settings'
};

/* ==========================================================================
   MODULE 2: AUTHENTICATION & USER PROFILE MANAGER
   ========================================================================== */
const AuthManager = {
  currentUser: null,

  init() {
    this.cacheDom();
    this.bindEvents();
    this.loadActiveUser();
  },

  cacheDom() {
    this.authModal = document.getElementById('authModal');
    this.authOpenBtn = document.getElementById('authOpenBtn');
    this.authModalClose = document.getElementById('authModalClose');
    this.tabLoginBtn = document.getElementById('tabLoginBtn');
    this.tabSignupBtn = document.getElementById('tabSignupBtn');
    this.loginTabPanel = document.getElementById('loginTabPanel');
    this.signupTabPanel = document.getElementById('signupTabPanel');
    this.loginForm = document.getElementById('loginForm');
    this.signupForm = document.getElementById('signupForm');
    this.authAlert = document.getElementById('authAlert');
    this.demoLoginBtn = document.getElementById('demoLoginBtn');
    this.forgotPassBtn = document.getElementById('forgotPassBtn');
    
    // Header state elements
    this.userProfileBadge = document.getElementById('userProfileBadge');
    this.userDisplayName = document.getElementById('userDisplayName');
    this.logoutBtn = document.getElementById('logoutBtn');
  },

  bindEvents() {
    // Open/Close modal
    this.authOpenBtn.addEventListener('click', () => this.openModal('login'));
    this.authModalClose.addEventListener('click', () => this.closeModal());
    this.authModal.addEventListener('click', (e) => {
      if (e.target === this.authModal) this.closeModal();
    });

    // Tab Switcher
    this.tabLoginBtn.addEventListener('click', () => this.switchTab('login'));
    this.tabSignupBtn.addEventListener('click', () => this.switchTab('signup'));

    // Form Submissions
    this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    this.signupForm.addEventListener('submit', (e) => this.handleSignup(e));

    // Demo Mode Button
    this.demoLoginBtn.addEventListener('click', () => this.handleDemoLogin());

    // Forgot Password Guidance
    this.forgotPassBtn.addEventListener('click', () => {
      this.showAlert('In this offline mini-project demo, accounts are stored in your browser. You can register a new test account or use Quick Demo Mode!', 'success');
    });

    // Show/Hide Password Toggle Buttons
    document.querySelectorAll('.toggle-password-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (input) {
          const isPassword = input.type === 'password';
          input.type = isPassword ? 'text' : 'password';
          btn.textContent = isPassword ? '🙈' : '👁️';
        }
      });
    });

    // Logout
    this.logoutBtn.addEventListener('click', () => this.logout());
  },

  openModal(tab = 'login') {
    this.switchTab(tab);
    this.clearAlert();
    this.authModal.style.display = 'flex';
  },

  closeModal() {
    this.authModal.style.display = 'none';
    this.clearAlert();
  },

  switchTab(tab) {
    if (tab === 'login') {
      this.tabLoginBtn.classList.add('active');
      this.tabSignupBtn.classList.remove('active');
      this.loginTabPanel.style.display = 'block';
      this.signupTabPanel.style.display = 'none';
    } else {
      this.tabSignupBtn.classList.add('active');
      this.tabLoginBtn.classList.remove('active');
      this.loginTabPanel.style.display = 'none';
      this.signupTabPanel.style.display = 'block';
    }
    this.clearAlert();
  },

  showAlert(message, type = 'error') {
    this.authAlert.textContent = message;
    this.authAlert.className = `auth-alert ${type}`;
    this.authAlert.style.display = 'block';
  },

  clearAlert() {
    this.authAlert.textContent = '';
    this.authAlert.style.display = 'none';
  },

  getRegisteredUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    } catch {
      return [];
    }
  },

  saveRegisteredUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  loadActiveUser() {
    try {
      const activeUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVE_USER));
      if (activeUser && activeUser.name) {
        this.setUserState(activeUser);
      } else {
        this.clearUserState();
      }
    } catch {
      this.clearUserState();
    }
  },

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
      this.showAlert('Please fill in both your email address and password.');
      return;
    }

    const users = this.getRegisteredUsers();
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (matchedUser) {
      this.setUserState({ name: matchedUser.name, email: matchedUser.email, isDemo: false });
      this.closeModal();
      showToast(`Welcome back, ${matchedUser.name}! Let's find your peace today.`);
    } else {
      this.showAlert('Invalid email or password. Please verify or use Quick Demo Mode.');
    }
  },

  handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();

    if (!name || !email || !password || !confirmPassword) {
      this.showAlert('All fields are required.');
      return;
    }

    if (password.length < 6) {
      this.showAlert('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      this.showAlert('Passwords do not match. Please re-check.');
      return;
    }

    const users = this.getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      this.showAlert('An account with this email address already exists. Please sign in.');
      return;
    }

    const newUser = { name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    this.saveRegisteredUsers(users);

    this.setUserState({ name: newUser.name, email: newUser.email, isDemo: false });
    this.closeModal();
    showToast(`Account created! Welcome to MindEase AI, ${newUser.name}.`);
  },

  handleDemoLogin() {
    const demoUser = {
      name: 'Zen Explorer',
      email: 'demo@mindease.ai',
      isDemo: true
    };
    this.setUserState(demoUser);
    this.closeModal();
    showToast('Signed in as Zen Explorer (Quick Demo Mode). Enjoy your calm!');
  },

  setUserState(user) {
    this.currentUser = user;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
    this.userDisplayName.textContent = user.name;
    this.userProfileBadge.style.display = 'flex';
    this.authOpenBtn.style.display = 'none';
  },

  clearUserState() {
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    this.userProfileBadge.style.display = 'none';
    this.authOpenBtn.style.display = 'inline-flex';
  },

  logout() {
    this.clearUserState();
    showToast('Signed out peacefully. Come back whenever you need to breathe.');
  }
};

/* ==========================================================================
   MODULE 3: AI MOOD RECOMMENDATION ENGINE
   ========================================================================== */
const MOOD_DATA = {
  stressed: {
    title: 'Box Breathing (Sama Vritti) for Cortisol Reduction',
    summary: 'When work or exams cause acute stress, equal-ratio 4-4-4-4 breathing stabilizes your autonomic nervous system and slows a racing pulse within minutes.',
    duration: 5,
    pattern: 'box',
    patternText: '🫁 Pattern: 4s Inhale - 4s Hold - 4s Exhale - 4s Rest',
    sound: 'rain',
    soundText: '🎵 Ambient Match: Rainfall'
  },
  anxious: {
    title: '4-7-8 Parasympathetic Vagal Reset',
    summary: 'A scientifically validated breathwork sequence formulated by Dr. Andrew Weil. The prolonged 8-second exhale activates the vagus nerve to dispel anxiety.',
    duration: 5,
    pattern: '478',
    patternText: '🫁 Pattern: 4s Inhale - 7s Hold - 8s Exhale',
    sound: 'ocean',
    soundText: '🎵 Ambient Match: Ocean Waves'
  },
  sad: {
    title: 'Heart-Centered Grounding & Deep Release',
    summary: 'Gently soothing breathing with a smooth extended exhale, allowing heavy emotional tension to dissolve with supportive harmonic resonance.',
    duration: 10,
    pattern: 'deep',
    patternText: '🫁 Pattern: 4s Inhale - 2s Hold - 6s Exhale - 2s Rest',
    sound: 'bowl',
    soundText: '🎵 Ambient Match: Tibetan Singing Bowl'
  },
  tired: {
    title: 'Gentle Energy Renewal & Awakening Breath',
    summary: 'A short 2-minute restorative mindfulness pause that replenishes blood oxygenation without inducing jittery nervous tension.',
    duration: 2,
    pattern: 'energizing',
    patternText: '🫁 Pattern: 4s Inhale - 1s Hold - 4s Exhale - 1s Rest',
    sound: 'forest',
    soundText: '🎵 Ambient Match: Forest Ambience'
  },
  happy: {
    title: 'Joy Cultivation & Mindful Presence',
    summary: 'Celebrate and anchor your positive emotional energy. Steady conscious breathing helps you savor peace, gratitude, and mental clarity.',
    duration: 5,
    pattern: 'box',
    patternText: '🫁 Pattern: 4s Inhale - 4s Hold - 4s Exhale - 4s Rest',
    sound: 'wind',
    soundText: '🎵 Ambient Match: Gentle Wind'
  }
};

const MoodEngine = {
  currentMood: 'stressed',

  init() {
    this.cacheDom();
    this.bindEvents();
    this.renderRecommendation('stressed');
  },

  cacheDom() {
    this.moodCards = document.querySelectorAll('.mood-card');
    this.recBadge = document.getElementById('recBadge');
    this.recTitle = document.getElementById('recTitle');
    this.recSummary = document.getElementById('recSummary');
    this.recDuration = document.getElementById('recDuration');
    this.recBreathType = document.getElementById('recBreathType');
    this.recSound = document.getElementById('recSound');
    this.applyRecBtn = document.getElementById('applyRecBtn');
  },

  bindEvents() {
    this.moodCards.forEach(card => {
      card.addEventListener('click', () => {
        const mood = card.getAttribute('data-mood');
        this.selectMood(mood);
      });
    });

    this.applyRecBtn.addEventListener('click', () => {
      this.applyRecommendation();
    });
  },

  selectMood(mood) {
    this.currentMood = mood;
    this.moodCards.forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-mood') === mood);
    });
    this.renderRecommendation(mood);
  },

  renderRecommendation(mood) {
    const data = MOOD_DATA[mood];
    if (!data) return;

    const moodCapitalized = mood.charAt(0).toUpperCase() + mood.slice(1);
    this.recBadge.textContent = `Recommended for: ${moodCapitalized}`;
    this.recTitle.textContent = data.title;
    this.recSummary.textContent = data.summary;
    this.recDuration.textContent = `⏱️ Recommended: ${data.duration} Minutes`;
    this.recBreathType.textContent = data.patternText;
    this.recSound.textContent = data.soundText;
  },

  applyRecommendation() {
    const data = MOOD_DATA[this.currentMood];
    if (!data) return;

    // 1. Sync Meditation Player settings
    MeditationPlayer.setDuration(data.duration);
    MeditationPlayer.setPattern(data.pattern);

    // 2. Play matching ASMR soundscape automatically
    SoundscapeMixer.playSingle(data.sound);

    // 3. Smooth scroll to meditation section
    const medSection = document.getElementById('meditate');
    medSection.scrollIntoView({ behavior: 'smooth' });

    showToast(`Loaded ${data.duration}-min ${data.pattern.toUpperCase()} session and matching soundscape!`);
  }
};

/* ==========================================================================
   MODULE 4: GUIDED MEDITATION & BREATHING ENGINE
   ========================================================================== */
const BREATH_PATTERNS = {
  box: [
    { phase: 'inhale', text: 'Breathe In Slowly', duration: 4 },
    { phase: 'hold', text: 'Hold Your Breath', duration: 4 },
    { phase: 'exhale', text: 'Slowly Exhale', duration: 4 },
    { phase: 'rest', text: 'Rest & Pause', duration: 4 }
  ],
  '478': [
    { phase: 'inhale', text: 'Inhale Quietly', duration: 4 },
    { phase: 'hold', text: 'Gently Hold', duration: 7 },
    { phase: 'exhale', text: 'Whoosh Exhale', duration: 8 }
  ],
  deep: [
    { phase: 'inhale', text: 'Deep Belly Inhale', duration: 4 },
    { phase: 'hold', text: 'Hold Lightly', duration: 2 },
    { phase: 'exhale', text: 'Long Gentle Exhale', duration: 6 },
    { phase: 'rest', text: 'Rest In Peace', duration: 2 }
  ],
  energizing: [
    { phase: 'inhale', text: 'Deep Inhale', duration: 4 },
    { phase: 'hold', text: 'Hold Breath', duration: 1 },
    { phase: 'exhale', text: 'Smooth Exhale', duration: 4 },
    { phase: 'rest', text: 'Rest', duration: 1 }
  ]
};

const MEDITATION_CUES = [
  "Find a comfortable posture. Soften your jaw, relax your shoulders, and let go of tension.",
  "Notice the gentle flow of air entering your nostrils, cool and refreshing.",
  "Feel your chest and abdomen rise naturally with every peaceful breath.",
  "There is nowhere you need to rush to. This moment belongs entirely to you.",
  "As thoughts arise, simply acknowledge them like clouds passing in a vast blue sky.",
  "You are safe, supported, and grounded in the present moment.",
  "With each slow exhale, imagine releasing any fatigue or worry stored in your muscles.",
  "Deep peace surrounds you. You are cultivating calm and emotional resilience."
];

const MeditationPlayer = {
  totalSeconds: 300, // Default 5 mins
  remainingSeconds: 300,
  patternKey: 'box',
  isPlaying: false,
  isPaused: false,
  timerInterval: null,
  cycleTimeout: null,
  voiceEnabled: true,
  currentCueIndex: 0,
  currentPhaseStep: 0,

  init() {
    this.cacheDom();
    this.bindEvents();
    this.updateDisplayTimer();
  },

  cacheDom() {
    this.durButtons = document.querySelectorAll('.duration-toggle .btn-pill');
    this.patternSelect = document.getElementById('breathPatternSelect');
    this.voiceToggleBtn = document.getElementById('voiceToggleBtn');
    this.voiceStatusText = document.getElementById('voiceStatusText');
    this.breathingCircle = document.getElementById('breathingCircle');
    this.breathInstruction = document.getElementById('breathInstruction');
    this.breathPhaseTimer = document.getElementById('breathPhaseTimer');
    this.sessionProgressRing = document.getElementById('sessionProgressRing');
    this.guidedSubtitle = document.getElementById('guidedSubtitle');
    this.sessionTimerDigits = document.getElementById('sessionTimerDigits');
    this.startBtn = document.getElementById('startMeditationBtn');
    this.startBtnLabel = document.getElementById('startBtnLabel');
    this.pauseBtn = document.getElementById('pauseMeditationBtn');
    this.stopBtn = document.getElementById('stopMeditationBtn');
  },

  bindEvents() {
    // Duration Buttons
    this.durButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isPlaying) return;
        const mins = parseInt(btn.getAttribute('data-minutes'), 10);
        this.setDuration(mins);
      });
    });

    // Pattern Select
    this.patternSelect.addEventListener('change', (e) => {
      this.patternKey = e.target.value;
      if (!this.isPlaying) {
        this.breathInstruction.textContent = 'Ready';
        this.breathPhaseTimer.textContent = 'Click Start';
      }
    });

    // Voice Toggle
    this.voiceToggleBtn.addEventListener('click', () => {
      this.voiceEnabled = !this.voiceEnabled;
      this.voiceToggleBtn.classList.toggle('active', this.voiceEnabled);
      this.voiceStatusText.textContent = this.voiceEnabled ? 'Voice On' : 'Voice Off';
      if (!this.voiceEnabled) {
        window.speechSynthesis?.cancel();
      }
    });

    // Controls
    this.startBtn.addEventListener('click', () => {
      if (!this.isPlaying) {
        this.startSession();
      } else if (this.isPaused) {
        this.resumeSession();
      }
    });

    this.pauseBtn.addEventListener('click', () => this.pauseSession());
    this.stopBtn.addEventListener('click', () => this.stopSession());
  },

  setDuration(minutes) {
    this.durButtons.forEach(b => {
      b.classList.toggle('active', parseInt(b.getAttribute('data-minutes'), 10) === minutes);
    });
    this.totalSeconds = minutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.updateDisplayTimer();
    this.setProgressRing(0);
  },

  setPattern(pattern) {
    this.patternKey = pattern;
    this.patternSelect.value = pattern;
  },

  startSession() {
    this.isPlaying = true;
    this.isPaused = false;
    this.remainingSeconds = this.totalSeconds;
    this.currentPhaseStep = 0;
    this.currentCueIndex = 0;

    this.startBtn.disabled = true;
    this.startBtnLabel.textContent = 'Playing';
    this.pauseBtn.disabled = false;
    this.stopBtn.disabled = false;

    // Initial voice greeting
    this.speak("Welcome to your MindEase session. Close your eyes or soften your gaze. Let us breathe together.");

    // Rotate subtle guided text
    this.updateSubtitle(MEDITATION_CUES[0]);

    // Start Master Timer
    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      this.updateDisplayTimer();

      const progressRatio = (this.totalSeconds - this.remainingSeconds) / this.totalSeconds;
      this.setProgressRing(progressRatio);

      // Rotate cues every 30 seconds
      if (this.remainingSeconds % 30 === 0 && this.remainingSeconds > 0) {
        this.currentCueIndex = (this.currentCueIndex + 1) % MEDITATION_CUES.length;
        const nextCue = MEDITATION_CUES[this.currentCueIndex];
        this.updateSubtitle(nextCue);
        this.speak(nextCue);
      }

      if (this.remainingSeconds <= 0) {
        this.completeSession();
      }
    }, 1000);

    // Start Breathing Phase Cycle
    this.runBreathingCycle();
  },

  pauseSession() {
    if (!this.isPlaying || this.isPaused) return;
    this.isPaused = true;
    clearInterval(this.timerInterval);
    clearTimeout(this.cycleTimeout);
    window.speechSynthesis?.pause();

    this.startBtn.disabled = false;
    this.startBtnLabel.textContent = 'Resume';
    this.pauseBtn.disabled = true;
    this.breathPhaseTimer.textContent = 'Session Paused';
    showToast('Meditation paused. Press Resume whenever you are ready.');
  },

  resumeSession() {
    if (!this.isPlaying || !this.isPaused) return;
    this.isPaused = false;

    this.startBtn.disabled = true;
    this.startBtnLabel.textContent = 'Playing';
    this.pauseBtn.disabled = false;

    window.speechSynthesis?.resume();

    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      this.updateDisplayTimer();

      const progressRatio = (this.totalSeconds - this.remainingSeconds) / this.totalSeconds;
      this.setProgressRing(progressRatio);

      if (this.remainingSeconds <= 0) {
        this.completeSession();
      }
    }, 1000);

    this.runBreathingCycle();
  },

  stopSession() {
    this.isPlaying = false;
    this.isPaused = false;
    clearInterval(this.timerInterval);
    clearTimeout(this.cycleTimeout);
    window.speechSynthesis?.cancel();

    this.startBtn.disabled = false;
    this.startBtnLabel.textContent = 'Start Session';
    this.pauseBtn.disabled = true;
    this.stopBtn.disabled = true;

    this.remainingSeconds = this.totalSeconds;
    this.updateDisplayTimer();
    this.setProgressRing(0);

    this.breathingCircle.className = 'breathing-circle';
    this.breathInstruction.textContent = 'Ready';
    this.breathPhaseTimer.textContent = 'Click Start';
    this.updateSubtitle('Session stopped. Take your time and resume whenever you wish.');
  },

  runBreathingCycle() {
    if (!this.isPlaying || this.isPaused) return;

    const pattern = BREATH_PATTERNS[this.patternKey] || BREATH_PATTERNS.box;
    const currentStep = pattern[this.currentPhaseStep];

    // Visual updates
    this.breathingCircle.className = `breathing-circle ${currentStep.phase}`;
    this.breathInstruction.textContent = currentStep.text;

    // Spoken cue for each phase transition
    if (this.voiceEnabled) {
      if (currentStep.phase === 'inhale') this.speak('Inhale softly');
      else if (currentStep.phase === 'hold') this.speak('Hold');
      else if (currentStep.phase === 'exhale') this.speak('Exhale slowly');
      else if (currentStep.phase === 'rest') this.speak('Rest');
    }

    // Step countdown
    let stepSecondsLeft = currentStep.duration;
    this.breathPhaseTimer.textContent = `${stepSecondsLeft}s`;

    const stepInterval = setInterval(() => {
      if (!this.isPlaying || this.isPaused) {
        clearInterval(stepInterval);
        return;
      }
      stepSecondsLeft--;
      if (stepSecondsLeft >= 0) {
        this.breathPhaseTimer.textContent = `${stepSecondsLeft}s`;
      }
      if (stepSecondsLeft <= 0) {
        clearInterval(stepInterval);
      }
    }, 1000);

    this.cycleTimeout = setTimeout(() => {
      if (!this.isPlaying || this.isPaused) return;
      this.currentPhaseStep = (this.currentPhaseStep + 1) % pattern.length;
      this.runBreathingCycle();
    }, currentStep.duration * 1000);
  },

  completeSession() {
    this.stopSession();
    SoundscapeMixer.playCompletionBell();

    const mins = Math.round(this.totalSeconds / 60);
    this.speak("Session complete. Notice how calm and centered you feel. Carry this peace forward with you.");
    this.updateSubtitle("✨ Session complete. Deep gratitude for taking this mindful pause for your health.");

    // Log to progress tracker
    ProgressTracker.logSession({
      duration: mins,
      pattern: this.patternKey,
      mood: MoodEngine.currentMood
    });

    showToast(`Wonderful job! You completed a ${mins}-minute meditation session. 🌸`);
  },

  updateDisplayTimer() {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    this.sessionTimerDigits.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  setProgressRing(ratio) {
    const totalCircumference = 911; // 2 * PI * 145
    const offset = totalCircumference - (ratio * totalCircumference);
    this.sessionProgressRing.style.strokeDashoffset = offset;
  },

  updateSubtitle(text) {
    this.guidedSubtitle.style.opacity = '0';
    setTimeout(() => {
      this.guidedSubtitle.textContent = `"${text}"`;
      this.guidedSubtitle.style.opacity = '1';
    }, 200);
  },

  speak(text) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.86;
      utterance.pitch = 0.98;
      
      const voices = window.speechSynthesis.getVoices();
      const calmVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US')));
      if (calmVoice) {
        utterance.voice = calmVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      // Graceful fallback if speech blocked
    }
  }
};

/* ==========================================================================
   MODULE 5: ASMR SOUNDSCAPE PROCEDURAL SYNTHESIZER & AUDIO MIXER
   (Uses native Web Audio API - Guaranteed 100% reliable without external audio 404s!)
   ========================================================================== */
const SoundscapeMixer = {
  audioCtx: null,
  masterGain: null,
  activeSounds: new Map(), // key -> { gainNode, stopFn }

  init() {
    this.cacheDom();
    this.bindEvents();
  },

  cacheDom() {
    this.soundCards = document.querySelectorAll('.sound-card');
    this.activeDot = document.getElementById('soundscapeActiveDot');
    this.activeText = document.getElementById('activeSoundsText');
    this.stopAllBtn = document.getElementById('stopAllAudioBtn');
    this.masterSlider = document.getElementById('masterVolumeSlider');
  },

  bindEvents() {
    // Play/Pause per sound card
    document.querySelectorAll('.btn-sound-play').forEach(btn => {
      btn.addEventListener('click', () => {
        const soundKey = btn.getAttribute('data-sound');
        this.toggleSound(soundKey);
      });
    });

    // Individual Volume Sliders
    document.querySelectorAll('.sound-volume').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const soundKey = slider.getAttribute('data-sound');
        const vol = parseFloat(e.target.value);
        this.setSoundVolume(soundKey, vol);
      });
    });

    // Stop All Sounds
    this.stopAllBtn.addEventListener('click', () => this.stopAll());

    // Master Volume Slider
    this.masterSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      if (this.masterGain && this.audioCtx) {
        this.masterGain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
      }
    });
  },

  ensureContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(parseFloat(this.masterSlider.value), this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  },

  toggleSound(key) {
    this.ensureContext();
    if (this.activeSounds.has(key)) {
      this.stopSound(key);
    } else {
      this.playSound(key);
    }
    this.updateToolbar();
  },

  playSingle(key) {
    this.ensureContext();
    if (!this.activeSounds.has(key)) {
      this.playSound(key);
    }
    this.updateToolbar();
  },

  playSound(key) {
    this.ensureContext();
    const card = document.querySelector(`.sound-card[data-sound="${key}"]`);
    const volSlider = card?.querySelector('.sound-volume');
    const initialVol = volSlider ? parseFloat(volSlider.value) : 0.7;

    const gainNode = this.audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(0.01, initialVol), this.audioCtx.currentTime + 1.2);
    gainNode.connect(this.masterGain);

    let stopFn = () => {};

    // Generate Procedural Audio based on chosen ASMR Soundscape
    switch (key) {
      case 'rain':
        stopFn = this.synthRain(gainNode);
        break;
      case 'ocean':
        stopFn = this.synthOcean(gainNode);
        break;
      case 'forest':
        stopFn = this.synthForest(gainNode);
        break;
      case 'wind':
        stopFn = this.synthWind(gainNode);
        break;
      case 'bowl':
        stopFn = this.synthSingingBowl(gainNode);
        break;
      case 'fire':
        stopFn = this.synthCampfire(gainNode);
        break;
      default:
        stopFn = this.synthRain(gainNode);
    }

    this.activeSounds.set(key, { gainNode, stopFn });

    // Update UI Card
    if (card) {
      card.classList.add('is-playing');
      const label = card.querySelector('.play-label');
      if (label) label.textContent = 'Pause';
    }

    // Award badge for exploring ASMR
    ProgressTracker.awardBadge('badgeSoundscapeLover');
  },

  stopSound(key) {
    const item = this.activeSounds.get(key);
    if (!item) return;

    try {
      item.gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.6);
      setTimeout(() => {
        item.stopFn();
        item.gainNode.disconnect();
      }, 700);
    } catch {
      item.stopFn();
    }

    this.activeSounds.delete(key);

    const card = document.querySelector(`.sound-card[data-sound="${key}"]`);
    if (card) {
      card.classList.remove('is-playing');
      const label = card.querySelector('.play-label');
      if (label) label.textContent = 'Play';
    }
  },

  setSoundVolume(key, vol) {
    const item = this.activeSounds.get(key);
    if (item && this.audioCtx) {
      item.gainNode.gain.setValueAtTime(Math.max(0.001, vol), this.audioCtx.currentTime);
    }
  },

  stopAll() {
    const keys = Array.from(this.activeSounds.keys());
    keys.forEach(k => this.stopSound(k));
    this.updateToolbar();
    showToast('All ASMR soundscapes stopped.');
  },

  updateToolbar() {
    const count = this.activeSounds.size;
    if (count > 0) {
      this.activeDot.classList.add('active');
      const names = Array.from(this.activeSounds.keys()).map(k => {
        return k.charAt(0).toUpperCase() + k.slice(1);
      }).join(' + ');
      this.activeText.textContent = `Playing (${count}): ${names}`;
    } else {
      this.activeDot.classList.remove('active');
      this.activeText.textContent = 'No sounds currently playing';
    }
  },

  /* ---------------- Procedural Sound Generators ---------------- */
  // 1. Rainfall Synthesizer: Continuous pink noise filtered with lowpass + random droplet impulses
  synthRain(destination) {
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoiseSource = this.audioCtx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1100;

    whiteNoiseSource.connect(filter);
    filter.connect(destination);
    whiteNoiseSource.start();

    // Subtle random raindrop pings
    const dropInterval = setInterval(() => {
      if (!this.audioCtx || destination.gain.value < 0.01) return;
      const osc = this.audioCtx.createOscillator();
      const dropGain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + Math.random() * 800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + 0.08);

      dropGain.gain.setValueAtTime(0.015, this.audioCtx.currentTime);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.08);

      osc.connect(dropGain);
      dropGain.connect(destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.09);
    }, 450);

    return () => {
      clearInterval(dropInterval);
      try { whiteNoiseSource.stop(); whiteNoiseSource.disconnect(); } catch {}
    };
  },

  // 2. Ocean Waves Synthesizer: Filtered noise modulated by a 0.1Hz LFO for rolling surf
  synthOcean(destination) {
    const bufferSize = this.audioCtx.sampleRate * 3;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.18;
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 450;
    filter.Q.value = 3;

    // LFO to modulate filter frequency (breathing ocean rhythm)
    const lfo = this.audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.11; // ~9 sec cycle

    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.value = 400; // sweeps filter between 150Hz and 850Hz

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(destination);

    noise.start();
    lfo.start();

    return () => {
      try {
        noise.stop();
        lfo.stop();
        noise.disconnect();
        lfo.disconnect();
      } catch {}
    };
  },

  // 3. Forest Ambience: Soft wind noise with periodic harmonic birdsong chirps
  synthForest(destination) {
    // Gentle foliage air noise
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.04;
    }
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    filter.Q.value = 1.2;

    noise.connect(filter);
    filter.connect(destination);
    noise.start();

    // Procedural bird chirps
    const chirpInterval = setInterval(() => {
      if (!this.audioCtx || destination.gain.value < 0.01) return;
      const osc = this.audioCtx.createOscillator();
      const chirpGain = this.audioCtx.createGain();
      osc.type = 'sine';
      const baseFreq = 1800 + Math.random() * 600;
      osc.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 400, this.audioCtx.currentTime + 0.06);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, this.audioCtx.currentTime + 0.14);

      chirpGain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
      chirpGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.16);

      osc.connect(chirpGain);
      chirpGain.connect(destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.18);
    }, 2800);

    return () => {
      clearInterval(chirpInterval);
      try { noise.stop(); noise.disconnect(); } catch {}
    };
  },

  // 4. Gentle Wind: Bandpass swept filtered noise
  synthWind(destination) {
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 2.5;

    const lfo = this.audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.2;

    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.value = 220;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(destination);
    noise.start();
    lfo.start();

    return () => {
      try {
        noise.stop();
        lfo.stop();
        noise.disconnect();
      } catch {}
    };
  },

  // 5. Tibetan Singing Bowl: Harmonic sine blend with beating vibrato
  synthSingingBowl(destination) {
    let active = true;

    const strikeBowl = () => {
      if (!active || !this.audioCtx) return;
      const fundamentals = [216, 432, 864, 1296]; // Pure 432Hz harmonic series
      fundamentals.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const bowlGain = this.audioCtx.createGain();
        osc.type = 'sine';
        // Add subtle detune for authentic singing bowl "beating"
        osc.frequency.setValueAtTime(freq + (idx * 0.8), this.audioCtx.currentTime);

        const amp = 0.09 / (idx + 1);
        bowlGain.gain.setValueAtTime(amp, this.audioCtx.currentTime);
        bowlGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 6.5);

        osc.connect(bowlGain);
        bowlGain.connect(destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 6.6);
      });
    };

    strikeBowl();
    const loopInterval = setInterval(strikeBowl, 7000);

    return () => {
      active = false;
      clearInterval(loopInterval);
    };
  },

  // 6. Cozy Campfire: Low rumble with randomized pop/crackle bursts
  synthCampfire(destination) {
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.05;
    }
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;

    noise.connect(filter);
    filter.connect(destination);
    noise.start();

    // Crackle clicks
    const crackleInterval = setInterval(() => {
      if (!this.audioCtx || destination.gain.value < 0.01) return;
      if (Math.random() > 0.45) {
        const osc = this.audioCtx.createOscillator();
        const crackleGain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100 + Math.random() * 900, this.audioCtx.currentTime);
        crackleGain.gain.setValueAtTime(0.025, this.audioCtx.currentTime);
        crackleGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.03);

        osc.connect(crackleGain);
        crackleGain.connect(destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.04);
      }
    }, 180);

    return () => {
      clearInterval(crackleInterval);
      try { noise.stop(); noise.disconnect(); } catch {}
    };
  },

  // Completion Chime Bell
  playCompletionBell() {
    this.ensureContext();
    const bellOsc = this.audioCtx.createOscillator();
    const bellGain = this.audioCtx.createGain();
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(528, this.audioCtx.currentTime); // Solfeggio 528Hz Transformation Tone
    bellGain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 4.0);

    bellOsc.connect(bellGain);
    bellGain.connect(this.masterGain);
    bellOsc.start();
    bellOsc.stop(this.audioCtx.currentTime + 4.2);
  }
};

/* ==========================================================================
   MODULE 6: AI MEDITATION ASSISTANT (CHATBOT)
   (Features an intelligent built-in conversational mindfulness engine + optional Gemini API)
   ========================================================================== */
const ChatAssistant = {
  apiKey: '',

  init() {
    this.cacheDom();
    this.bindEvents();
    this.loadApiKey();
  },

  cacheDom() {
    this.chatForm = document.getElementById('chatForm');
    this.chatInput = document.getElementById('chatInput');
    this.chatMessages = document.getElementById('chatMessages');
    this.quickPrompts = document.querySelectorAll('.prompt-chip');
    this.clearChatBtn = document.getElementById('clearChatBtn');
    this.openApiSettingsBtn = document.getElementById('openApiSettingsBtn');
    this.apiModal = document.getElementById('apiModal');
    this.apiModalClose = document.getElementById('apiModalClose');
    this.apiSettingsForm = document.getElementById('apiSettingsForm');
    this.geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
    this.clearApiKeyBtn = document.getElementById('clearApiKeyBtn');
    this.botStatusBadge = document.getElementById('botStatusBadge');
  },

  bindEvents() {
    this.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = this.chatInput.value.trim();
      if (!text) return;
      this.sendMessage(text);
      this.chatInput.value = '';
    });

    this.quickPrompts.forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        this.sendMessage(prompt);
      });
    });

    this.clearChatBtn.addEventListener('click', () => this.clearChat());

    // API Modal Handlers
    this.openApiSettingsBtn.addEventListener('click', () => {
      this.geminiApiKeyInput.value = this.apiKey;
      this.apiModal.style.display = 'flex';
    });

    this.apiModalClose.addEventListener('click', () => {
      this.apiModal.style.display = 'none';
    });

    this.apiModal.addEventListener('click', (e) => {
      if (e.target === this.apiModal) this.apiModal.style.display = 'none';
    });

    this.apiSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const key = this.geminiApiKeyInput.value.trim();
      this.saveApiKey(key);
      this.apiModal.style.display = 'none';
      showToast(key ? 'Google Gemini API Key activated!' : 'Using built-in mindfulness AI engine.');
    });

    this.clearApiKeyBtn.addEventListener('click', () => {
      this.saveApiKey('');
      this.geminiApiKeyInput.value = '';
      this.apiModal.style.display = 'none';
      showToast('API key removed. Using built-in mindfulness engine.');
    });
  },

  loadApiKey() {
    try {
      const savedKey = localStorage.getItem('mindease_gemini_key') || '';
      this.saveApiKey(savedKey, false);
    } catch {}
  },

  saveApiKey(key, persist = true) {
    this.apiKey = key;
    if (persist) {
      if (key) localStorage.setItem('mindease_gemini_key', key);
      else localStorage.removeItem('mindease_gemini_key');
    }

    if (this.apiKey) {
      this.botStatusBadge.innerHTML = '<span class="status-dot"></span> Google Gemini AI Active';
    } else {
      this.botStatusBadge.innerHTML = '<span class="status-dot"></span> Built-in Mindfulness AI Active';
    }
  },

  appendMessage(text, sender = 'user') {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${sender}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? '👤' : '🪷';

    const body = document.createElement('div');
    body.className = 'message-body';

    // Parse simple linebreaks
    const formatted = text.split('\n').filter(p => p.trim().length > 0).map(p => `<p>${this.escapeHtml(p)}</p>`).join('');
    body.innerHTML = formatted;

    const time = document.createElement('span');
    time.className = 'message-timestamp';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    body.appendChild(time);

    bubble.appendChild(avatar);
    bubble.appendChild(body);
    this.chatMessages.appendChild(bubble);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  },

  showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message-bubble bot-message typing-indicator-wrap';
    indicator.id = 'botTyping';
    indicator.innerHTML = `
      <div class="message-avatar">🪷</div>
      <div class="message-body">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    this.chatMessages.appendChild(indicator);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  },

  removeTypingIndicator() {
    const indicator = document.getElementById('botTyping');
    if (indicator) indicator.remove();
  },

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  async sendMessage(userText) {
    this.appendMessage(userText, 'user');
    this.showTypingIndicator();

    if (this.apiKey) {
      try {
        const response = await this.callGeminiAPI(userText);
        this.removeTypingIndicator();
        this.appendMessage(response, 'bot');
      } catch (err) {
        this.removeTypingIndicator();
        console.warn('Gemini API call failed, falling back to built-in AI:', err);
        const fallback = this.generateBuiltInResponse(userText);
        this.appendMessage(`${fallback}\n\n*(Note: Gemini API key check failed, answered via built-in mindfulness engine)*`, 'bot');
      }
    } else {
      // Simulate natural thinking delay for built-in assistant
      setTimeout(() => {
        this.removeTypingIndicator();
        const response = this.generateBuiltInResponse(userText);
        this.appendMessage(response, 'bot');
      }, 700);
    }
  },

  generateBuiltInResponse(input) {
    const text = input.toLowerCase();

    // 1. Exam / Academic / Work Overwhelm
    if (text.includes('exam') || text.includes('study') || text.includes('college') || text.includes('work') || text.includes('overwhelm') || text.includes('deadline')) {
      return "I hear how much pressure you are holding right now with your studies and deadlines. Remember: your worth is not measured solely by your academic output.\n\nTake this moment as a conscious reset:\n• Drop your shoulders away from your ears.\n• Unclench your jaw.\n• Try a quick 2-minute 'Box Breathing' session from our Meditation tab.\n\nYou do not have to conquer the whole mountain today—just focus on this single breath.";
    }

    // 2. Sleep / Insomnia
    if (text.includes('sleep') || text.includes('insomnia') || text.includes('night') || text.includes('tired') || text.includes('bed')) {
      return "Racing nighttime thoughts are so common when the nervous system hasn't had time to decompress from screen time and stress.\n\nHere is a soothing bedtime ritual:\n1. Switch your ASMR soundscape above to 'Rainfall' or 'Cozy Campfire'.\n2. Try the 4-7-8 breathing method: Inhale for 4s, hold for 7s, and exhale for 8s.\n3. Visualize each racing thought placed gently on a leaf floating down a slow-moving river.\n\nGive yourself full permission to let go of today. Rest is productive.";
    }

    // 3. Anxiety / Panic / Heart racing
    if (text.includes('anxi') || text.includes('panic') || text.includes('heart') || text.includes('scared') || text.includes('worry') || text.includes('nervous')) {
      return "I am right here with you. Take a slow breath with me right now. You are safe in this physical space.\n\nLet's do the 5-4-3-2-1 Grounding Technique together:\n• Look around and name 5 things you can see.\n• Touch 4 physical textures (your desk, clothing, fingertips).\n• Listen for 3 distinct sounds (like your fan or room ambience).\n• Identify 2 scents around you.\n• Acknowledge 1 positive truth about your strength.\n\nWhenever you are ready, head to our 'Guided Meditation' section and tap '4-7-8 Breathing'.";
    }

    // 4. How 4-7-8 breathing works
    if (text.includes('4-7-8') || text.includes('method') || text.includes('technique') || text.includes('how does')) {
      return "The 4-7-8 breathing method is known as a 'natural tranquilizer for the nervous system'.\n\nHere is the science:\n• Inhaling for 4 seconds fills your lungs with restorative oxygen.\n• Holding for 7 seconds allows oxygen to saturate your bloodstream and slows your pulse.\n• Exhaling through your mouth for a long 8 seconds activates the vagus nerve and triggers the parasympathetic 'rest-and-digest' reflex.\n\nPracticing this 4 cycles twice daily significantly lowers cortisol levels.";
    }

    // 5. Positive reflection / Motivation / Sadness
    if (text.includes('reflection') || text.includes('sad') || text.includes('lonely') || text.includes('positive') || text.includes('happy') || text.includes('quote')) {
      return "Here is your gentle reflection for today:\n\n'Peace is not the absence of storms outside, but the calm sanctuary you cultivate within yourself.'\n\nBe patient with your heart today. Even small pauses—like drinking a glass of water mindfully or listening to ocean waves—are profound acts of self-care. You are doing so much better than you give yourself credit for.";
    }

    // General default mindfulness response
    return "Thank you for sharing that with me. Mindfulness teaches us that every emotion is an honored guest—we don't need to fight it, only observe it with gentle compassion.\n\nWould you like to try a 5-minute guided meditation session or explore our ASMR Rainfall soundscape to quiet your mind? I am here with you.";
  },

  async callGeminiAPI(prompt) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    const systemPrompt = "You are MindEase AI, a peaceful, compassionate mindfulness and meditation guide. Keep responses soothing, emotionally supportive, concise (under 120 words), and focused on breathing, relaxation, and grounding. Never provide medical or clinical psychiatric diagnosis. Always encourage gentle mindfulness.";

    const bodyData = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nUser says: ${prompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 250
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
      throw new Error(`Gemini HTTP error ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) throw new Error('Empty response from Gemini API');
    return candidateText;
  },

  clearChat() {
    this.chatMessages.innerHTML = `
      <div class="message-bubble bot-message">
        <div class="message-avatar">🪷</div>
        <div class="message-body">
          <p>Chat cleared. I am here whenever you'd like to reflect or breathe. How are you feeling right now?</p>
          <span class="message-timestamp">Just now</span>
        </div>
      </div>
    `;
    showToast('Chat history cleared.');
  }
};

/* ==========================================================================
   MODULE 7: USER PROGRESS, BADGES & LOCALSTORAGE ANALYTICS
   ========================================================================== */
const ProgressTracker = {
  data: {
    totalMinutes: 0,
    totalSessions: 0,
    currentStreak: 0,
    lastActiveDate: null,
    badges: [],
    sessions: []
  },

  init() {
    this.cacheDom();
    this.loadProgress();
    this.bindEvents();
    this.renderStats();
  },

  cacheDom() {
    this.statMinutes = document.getElementById('statTotalMinutes');
    this.statSessions = document.getElementById('statTotalSessions');
    this.statStreak = document.getElementById('statCurrentStreak');
    this.statBadges = document.getElementById('statBadgesCount');
    this.historyTableBody = document.getElementById('historyTableBody');
    this.exportBtn = document.getElementById('exportHistoryBtn');
    this.resetBtn = document.getElementById('resetHistoryBtn');
  },

  bindEvents() {
    this.exportBtn.addEventListener('click', () => this.exportReport());
    this.resetBtn.addEventListener('click', () => this.resetProgress());
  },

  loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS));
      if (saved) {
        this.data = Object.assign(this.data, saved);
      }
    } catch {}
  },

  saveProgress() {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(this.data));
    this.renderStats();
  },

  logSession({ duration, pattern, mood }) {
    this.data.totalMinutes += duration;
    this.data.totalSessions += 1;

    // Calculate daily streak
    const todayStr = new Date().toISOString().split('T')[0];
    if (this.data.lastActiveDate) {
      const lastDate = new Date(this.data.lastActiveDate);
      const today = new Date(todayStr);
      const diffDays = Math.round((today - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        this.data.currentStreak += 1;
      } else if (diffDays > 1) {
        this.data.currentStreak = 1;
      }
    } else {
      this.data.currentStreak = 1;
    }
    this.data.lastActiveDate = todayStr;

    // Log session record
    const newRecord = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      duration: `${duration} mins`,
      pattern: pattern.toUpperCase(),
      mood: mood.charAt(0).toUpperCase() + mood.slice(1),
      status: 'Completed'
    };
    this.data.sessions.unshift(newRecord);

    // Evaluate Badges
    this.checkBadges();
    this.saveProgress();
  },

  checkBadges() {
    if (this.data.totalSessions >= 1) this.awardBadge('badgeFirstStep');
    if (this.data.totalMinutes >= 10) this.awardBadge('badgeSerenity');
    if (this.data.currentStreak >= 3) this.awardBadge('badgeZenStreak');
    if (this.data.totalSessions >= 5) this.awardBadge('badgeDeepMaster');
  },

  awardBadge(badgeId) {
    if (!this.data.badges.includes(badgeId)) {
      this.data.badges.push(badgeId);
      this.saveProgress();
      showToast('🌟 Milestone Unlocked! Check your Mindfulness Journey.');
    }
    const badgeEl = document.getElementById(badgeId);
    if (badgeEl) {
      badgeEl.classList.remove('locked');
      badgeEl.classList.add('unlocked');
    }
  },

  renderStats() {
    this.statMinutes.textContent = this.data.totalMinutes;
    this.statSessions.textContent = this.data.totalSessions;
    this.statStreak.textContent = this.data.currentStreak;
    this.statBadges.textContent = this.data.badges.length;

    // Unlock badges in DOM
    this.data.badges.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('locked');
        el.classList.add('unlocked');
      }
    });

    // Render Table Rows
    if (this.data.sessions.length === 0) {
      this.historyTableBody.innerHTML = `
        <tr class="empty-row">
          <td colspan="5">No completed meditation sessions yet. Start your first session above! 🌸</td>
        </tr>
      `;
    } else {
      this.historyTableBody.innerHTML = this.data.sessions.slice(0, 8).map(s => `
        <tr>
          <td>${s.timestamp}</td>
          <td><strong>${s.duration}</strong></td>
          <td>${s.pattern}</td>
          <td>${s.mood}</td>
          <td><span style="color: var(--color-success); font-weight: 600;">✓ ${s.status}</span></td>
        </tr>
      `).join('');
    }
  },

  exportReport() {
    if (this.data.sessions.length === 0) {
      showToast('No session data to export yet.');
      return;
    }

    const report = [
      '====================================================',
      '         MINDEASE AI - MINDFULNESS JOURNEY REPORT    ',
      '====================================================',
      `Generated On: ${new Date().toLocaleString()}`,
      `User Profile: ${AuthManager.currentUser ? AuthManager.currentUser.name : 'Guest'}`,
      `Total Minutes Meditated: ${this.data.totalMinutes}`,
      `Total Completed Sessions: ${this.data.totalSessions}`,
      `Current Streak: ${this.data.currentStreak} Day(s)`,
      `Badges Unlocked: ${this.data.badges.length}`,
      '----------------------------------------------------',
      'SESSION HISTORY LOG:',
      '----------------------------------------------------'
    ];

    this.data.sessions.forEach((s, idx) => {
      report.push(`[#${idx + 1}] Date: ${s.timestamp} | Duration: ${s.duration} | Breath: ${s.pattern} | Mood: ${s.mood}`);
    });

    report.push('====================================================');
    report.push('MindEase AI • College Mini Project in Web Engineering');

    const blob = new Blob([report.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MindEase_Report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    showToast('Mindfulness report downloaded successfully!');
  },

  resetProgress() {
    if (!confirm('Are you sure you want to reset your meditation statistics and history?')) return;
    this.data = {
      totalMinutes: 0,
      totalSessions: 0,
      currentStreak: 0,
      lastActiveDate: null,
      badges: [],
      sessions: []
    };
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    document.querySelectorAll('.badge-item').forEach(b => {
      b.classList.remove('unlocked');
      b.classList.add('locked');
    });
    this.renderStats();
    showToast('Your meditation progress has been reset.');
  }
};

/* ==========================================================================
   MODULE 8: AMBIENT PARTICLE STARDUST CANVAS
   ========================================================================== */
const ParticleAmbiance = {
  canvas: null,
  ctx: null,
  particles: [],
  particleCount: 45,
  animId: null,

  init() {
    this.canvas = document.getElementById('particleCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate initial gentle floating particles
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2 + 0.8,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.008
      });
    }

    this.animate();
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.y += p.speedY;
      p.x += p.speedX;
      p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;

      // Wrap around screen edges
      if (p.y < 0) p.y = this.canvas.height;
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(194, 182, 252, ${Math.max(0.1, Math.min(0.7, p.alpha))})`;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = 'rgba(155, 135, 245, 0.4)';
      this.ctx.fill();
    }

    this.animId = requestAnimationFrame(() => this.animate());
  }
};

/* ==========================================================================
   MODULE 9: NAVIGATION & TOAST NOTIFICATION HELPERS
   ========================================================================== */
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinksContainer = document.getElementById('navLinks');

  // Mobile menu toggle
  mobileMenuBtn?.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
    const isOpen = navLinksContainer.classList.contains('open');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('open');
      mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  // Active section scroll spy
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-nav') === current);
    });
  }, { passive: true });
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   APPLICATION ENTRYPOINT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  AuthManager.init();
  MoodEngine.init();
  MeditationPlayer.init();
  SoundscapeMixer.init();
  ChatAssistant.init();
  ProgressTracker.init();
  ParticleAmbiance.init();
  setupNavigation();

  console.log('%c MindEase AI – Guided Meditations & ASMR ', 'background: #9B87F5; color: #fff; font-size: 14px; font-weight: bold; padding: 4px 10px; border-radius: 4px;');
  console.log('College Mini Project initialized successfully. All systems operational.');
});
