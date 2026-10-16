# ASMR Sounds Directory

This directory is part of the **MindEase AI – Guided Meditations & ASMR** web application.

## 🎵 How Audio Works in MindEase AI

MindEase AI is architected with a **dual audio strategy** designed specifically to prevent broken link errors during college project demonstrations:

### 1. Built-In Procedural Synthesizer (Default & Active)
MindEase AI generates all 6 ambient soundscapes in real-time using the **HTML5 Web Audio API** (`AudioContext`).
- **Zero External Dependencies**: Sounds never fail, buffer, or return 404 HTTP errors.
- **Organic Audio Algorithms**:
  - **Rainfall**: Pink noise generator with randomized high-frequency raindrop pings.
  - **Ocean Waves**: Dual filtered noise modulated by a 0.11 Hz LFO simulating rhythmic rolling surf.
  - **Forest Ambience**: Whispering pine tree breeze with procedural harmonic bird chirps.
  - **Gentle Wind**: Bandpass-filtered pink noise with dual slow undulation sweeps.
  - **Singing Bowl**: 432 Hz Solfeggio harmonic sine wave additive synthesis with natural beat-frequency vibrato.
  - **Campfire**: Lowpass warm rumble blended with randomized crackle and pop bursts.

---

### 2. Optional: Adding Your Own Royalty-Free Audio Files (.mp3)
If you wish to use recorded audio files instead of procedural soundscapes:
1. Place your audio files inside this `assets/sounds/` folder:
   - `rain.mp3`
   - `ocean.mp3`
   - `forest.mp3`
   - `wind.mp3`
   - `bowl.mp3`
   - `fire.mp3`
2. Recommended Free & Royalty-Free CC0 Audio Sources:
   - [Pixabay Audio](https://pixabay.com/sound-effects/) (Free royalty-free ambient loops)
   - [Freesound.org](https://freesound.org/) (Creative Commons field recordings)
   - [BBC Sound Effects Archive](https://sound-effects.bbcrewind.co.uk/) (Nature and weather ambiences)
