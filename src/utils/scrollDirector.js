/**
 * Star Solutions — Master Scroll Director
 * 
 * Single source of truth connecting:
 * 1. Lenis Smooth Scroll
 * 2. GSAP ScrollTrigger
 * 3. 3D Astrolabe Gear Rotations & Section Morphing
 * 4. DialScrollHUD Vernier Degrees & Physical Detents
 * 5. Audio Escapement Ticks
 */

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundEngine } from './audio';
import { MOTION_INTENSITY, prefersReducedMotion } from '../config/motionSystem';

gsap.registerPlugin(ScrollTrigger);

class ScrollDirector {
  constructor() {
    this.lenis = null;
    this.subscribers = new Set();
    this.lastDetent = 0;
    this.activeSection = 'hero';
    this.progress = 0;
    this.degree = 0;
    this.velocity = 0;
    this.isInitialized = false;
    this.tickerCb = null;

    this.sectionIds = ['hero', 'services', 'work', 'about', 'tech', 'footer'];
  }

  init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    // 1. Initialize Lenis Smooth Scroll
    this.lenis = new Lenis({
      duration: prefersReducedMotion() ? 0.1 : 1.35 * Math.max(0.6, MOTION_INTENSITY),
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion(),
      touchMultiplier: 1.5,
    });

    // 2. Synchronize Lenis with GSAP ScrollTrigger
    this.lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      this.handleScroll(e);
    });

    this.tickerCb = (time) => {
      this.lenis.raf(time * 1000);
    };

    gsap.ticker.add(this.tickerCb);
    gsap.ticker.lagSmoothing(0);

    this.isInitialized = true;
    this.updateScrollMetrics();
  }

  handleScroll(e) {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const rawProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
    const rawDegree = Math.round(rawProgress * 360);

    this.progress = rawProgress;
    this.degree = rawDegree;
    this.velocity = e?.velocity || 0;

    // Trigger physical ratchet escapement tick on every 15° detent
    const currentDetent = Math.floor(rawDegree / 15);
    if (currentDetent !== this.lastDetent && Math.abs(this.velocity) > 0.05) {
      this.lastDetent = currentDetent;
      soundEngine.playRatchetTick(750 + (currentDetent % 8) * 35);
    }

    // Determine Active Section with stable focal threshold
    const scrollPos = scrollY + window.innerHeight * 0.4;
    for (let i = this.sectionIds.length - 1; i >= 0; i--) {
      const id = this.sectionIds[i];
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollPos) {
        if (this.activeSection !== id) {
          this.activeSection = id;
        }
        break;
      }
    }

    // Broadcast to all subscribed listeners
    this.notify();
  }

  updateScrollMetrics() {
    if (typeof window === 'undefined') return;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    this.progress = Math.min(1, Math.max(0, scrollY / maxScroll));
    this.degree = Math.round(this.progress * 360);
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    // Initial call
    callback(this.getState());
    return () => {
      this.subscribers.delete(callback);
    };
  }

  notify() {
    const state = this.getState();
    this.subscribers.forEach((cb) => cb(state));
  }

  getState() {
    return {
      progress: this.progress,
      degree: this.degree,
      velocity: this.velocity,
      activeSection: this.activeSection,
      lenis: this.lenis,
    };
  }

  scrollTo(target, options = {}) {
    if (this.lenis) {
      this.lenis.scrollTo(target, {
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        ...options,
      });
    } else {
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
    }
  }

  destroy() {
    if (this.tickerCb) {
      gsap.ticker.remove(this.tickerCb);
    }
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
    this.subscribers.clear();
    this.isInitialized = false;
  }
}

export const scrollDirector = new ScrollDirector();
