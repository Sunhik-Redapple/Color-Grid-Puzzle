// Sound & Music engine using Web Audio API (Synthesized procedural audio)
// Works reliably across all browsers without external assets, network delays, or licensing issues.

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMusicMuted: boolean = false;
  private isSfxMuted: boolean = false;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private musicTimeoutId: number | null = null;
  private currentStep: number = 0;

  // Pentatonic warm lofi / ambient marimba chords & notes
  // Clean, soothing, non-distracting study/puzzle beats
  private bassNotes: number[] = [130.81, 146.83, 164.81, 196.0, 220.0]; // C3, D3, E3, G3, A3
  private melodyNotes: number[] = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]; // C4..E5

  constructor() {
    try {
      const savedMusic = localStorage.getItem('grid_puzzle_music_muted');
      const savedSfx = localStorage.getItem('grid_puzzle_sfx_muted');
      if (savedMusic !== null) this.isMusicMuted = savedMusic === 'true';
      if (savedSfx !== null) this.isSfxMuted = savedSfx === 'true';
    } catch {
      // ignore
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.musicGainNode = this.ctx.createGain();
        this.musicGainNode.gain.setValueAtTime(this.isMusicMuted ? 0 : 0.18, this.ctx.currentTime);
        this.musicGainNode.connect(this.ctx.destination);

        this.sfxGainNode = this.ctx.createGain();
        this.sfxGainNode.gain.setValueAtTime(this.isSfxMuted ? 0 : 0.45, this.ctx.currentTime);
        this.sfxGainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // --- Sound Effects ---

  // Subtle wooden tap / click when selecting a block
  playTileSelect() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.05);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Satisfying fluid swap chime (two distinct marimba pops)
  playTileSwap() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const now = this.ctx.currentTime;
    [
      { freq: 523.25, delay: 0.0 }, // C5
      { freq: 659.25, delay: 0.045 }, // E5
    ].forEach(({ freq, delay }) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + delay;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + 0.08);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t);
      osc.stop(t + 0.15);
    });
  }

  // Crystalline ice thaw sound effect (gentle high tinkling chime with noise burst)
  playIceThaw() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const now = this.ctx.currentTime;
    const notes = [880, 1046.5, 1318.51, 1567.98, 2093.0]; // A5..C7
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.035;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.96, t + 0.22);

      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  // Harmonic chord progression when an anchor group satisfies its exact target count
  playGroupComplete() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const now = this.ctx.currentTime;
    // Major 9th chord arpeggio
    const chord = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.055;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.32, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  // Grand triumph fanfare when entire level is solved!
  playLevelComplete() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const now = this.ctx.currentTime;
    // Ascending celebratory fanfare: C5, E5, G5, C6, E6, G6 with warm bloom
    const fanfare = [
      { f: 523.25, d: 0.0, dur: 0.3 },
      { f: 659.25, d: 0.1, dur: 0.3 },
      { f: 783.99, d: 0.2, dur: 0.35 },
      { f: 1046.5, d: 0.32, dur: 0.5 },
      { f: 1318.51, d: 0.45, dur: 0.7 },
      { f: 1567.98, d: 0.58, dur: 1.1 },
    ];

    fanfare.forEach(({ f, d, dur }) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + d;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t);
      osc.stop(t + dur + 0.05);
    });
  }

  // Soft "dull wood" click for locked/frozen tile or illegal move attempt
  playLockedError() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  // Whimsical reverse pitch whoosh for Undo action
  playUndo() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(740, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.14);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.17);
  }

  // Button UI pop
  playButtonTap() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(550, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  // --- Background Music Procedural Sequencer ---
  // Generates a calming, gentle ambient marimba & kalimba groove in C major pentatonic
  // Seamless loop with varied patterns so it never becomes annoying or repetitive.

  startMusic() {
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.initContext();
    this.scheduleNextMusicNote();
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimeoutId !== null) {
      window.clearTimeout(this.musicTimeoutId);
      this.musicTimeoutId = null;
    }
  }

  private scheduleNextMusicNote() {
    if (!this.isMusicPlaying) return;

    this.initContext();
    if (this.ctx && this.musicGainNode && !this.isMusicMuted) {
      const now = this.ctx.currentTime;
      const step = this.currentStep % 16;

      // Play soft bass pulse every 4 steps
      if (step % 4 === 0) {
        const bassFreq = this.bassNotes[Math.floor(this.currentStep / 4) % this.bassNotes.length];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(bassFreq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(gain);
        gain.connect(this.musicGainNode);

        osc.start(now);
        osc.stop(now + 0.7);
      }

      // Play ambient marimba note on selected beats
      // Uses a pleasant syncopated pattern
      const shouldPlayMelody = [0, 2, 3, 6, 8, 10, 11, 14].includes(step);
      if (shouldPlayMelody) {
        const melodyIdx = (this.currentStep * 3 + (step % 5)) % this.melodyNotes.length;
        const melodyFreq = this.melodyNotes[melodyIdx];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Warm sine/soft triangle marimba
        osc.type = 'sine';
        osc.frequency.setValueAtTime(melodyFreq, now);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc.connect(gain);
        gain.connect(this.musicGainNode);

        osc.start(now);
        osc.stop(now + 0.4);
      }
    }

    this.currentStep++;
    // 120 BPM 16th notes -> ~125ms per step
    this.musicTimeoutId = window.setTimeout(() => {
      this.scheduleNextMusicNote();
    }, 180);
  }

  // Volume toggles & persistent states
  toggleMusic(): boolean {
    this.isMusicMuted = !this.isMusicMuted;
    try {
      localStorage.setItem('grid_puzzle_music_muted', String(this.isMusicMuted));
    } catch {
      // ignore
    }

    if (this.ctx && this.musicGainNode) {
      this.musicGainNode.gain.setValueAtTime(this.isMusicMuted ? 0 : 0.18, this.ctx.currentTime);
    }

    if (!this.isMusicMuted && !this.isMusicPlaying) {
      this.startMusic();
    }
    return !this.isMusicMuted;
  }

  toggleSfx(): boolean {
    this.isSfxMuted = !this.isSfxMuted;
    try {
      localStorage.setItem('grid_puzzle_sfx_muted', String(this.isSfxMuted));
    } catch {
      // ignore
    }

    if (this.ctx && this.sfxGainNode) {
      this.sfxGainNode.gain.setValueAtTime(this.isSfxMuted ? 0 : 0.45, this.ctx.currentTime);
    }
    if (!this.isSfxMuted) {
      this.playTileSelect();
    }
    return !this.isSfxMuted;
  }

  getMusicMuted() {
    return this.isMusicMuted;
  }

  getSfxMuted() {
    return this.isSfxMuted;
  }
}

export const soundManager = new SoundManager();
