/**
 * Royal Astronomical Vault — Restrained Physical Acoustic Engine
 * Sound with restraint: 3 to 4 physical analog mechanisms (brass dial ratchet click, 
 * escapement tick, vellum paper thud). 
 * Zero ambient synth pads. Muted by default.
 */

class AstronomicalSoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.init();
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.playEscapementClick();
    }
    return this.enabled;
  }

  // 1. Brass Dial Ratchet Click (Short, metallic, crisp friction)
  playRatchetTick(detentPitch = 880) {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(detentPitch, t);
      filter.Q.setValueAtTime(4.0, t);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(detentPitch, t);
      osc.frequency.exponentialRampToValueAtTime(detentPitch * 0.4, t + 0.035);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.035);
    } catch (e) {}
  }

  // 2. Mechanical Escapement Latch (Double mechanical tick-lock)
  playEscapementClick() {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      this.playImpulse(1400, t, 0.025, 0.045);
      this.playImpulse(950, t + 0.04, 0.035, 0.035);
    } catch (e) {}
  }

  // 3. Vellum Paper Slide / Plate Thud (Warm, low-frequency damp friction)
  playPlateSlide() {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, t);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.12);
    } catch (e) {}
  }

  // 4. Astrolabe Celestial Chime (Acoustic brass resonance for key action reveals)
  playCelestialLock() {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const fundamental = 587.33; // D5
      this.playImpulse(fundamental, t, 0.35, 0.035);
      this.playImpulse(fundamental * 1.5, t + 0.02, 0.45, 0.02);
      this.playImpulse(fundamental * 2.0, t + 0.05, 0.6, 0.015);
    } catch (e) {}
  }

  playImpulse(freq, startTime, duration, volume = 0.03) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {}
  }
}

export const soundEngine = new AstronomicalSoundEngine();
