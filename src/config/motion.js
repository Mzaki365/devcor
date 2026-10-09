/**
 * Star Solutions — Royal Astronomical Vault Motion Language
 * Concept: Mechanical escapements, brass dial detents, and deliberate hand-inked line drawing.
 * Banished: Stock expo.out, perfectly uniform staggers, and uniform floating loops.
 */

export const MOTION = {
  // 3 Signature Custom Easing Curves
  easing: {
    // 1. Mechanical Escapement: Snaps forward with a subtle 1-2% ratchet overshoot before locking
    escapement: 'cubic-bezier(0.22, 1.25, 0.36, 1)',
    // 2. Heavy Brass Inertia: Starts with friction, glides heavily, halts firmly
    brassInertia: 'cubic-bezier(0.16, 1, 0.3, 1)',
    // 3. Ink & Quill Draw: Natural human drawing cadence with deceleration
    inkDraw: 'cubic-bezier(0.65, 0, 0.25, 1)',
    // 4. Aperture Shutter: Iris blade snap
    aperture: 'cubic-bezier(0.85, 0, 0.15, 1)',
  },

  // GSAP-formatted ease strings
  gsapEase: {
    escapement: 'back.out(1.4)',
    brassInertia: 'power3.out',
    inkDraw: 'power2.inOut',
    ratchetSnap: 'back.out(2.0)',
  },

  // 3 Distinct Time Scales
  duration: {
    // Fast mechanical index/switch click
    tick: 0.18,
    // Human dial rotation, plate reveal, card interaction
    deliberate: 0.7,
    // Planetary orbit, armillary ring unlock, celestial alignment
    celestial: 1.6,
  },

  // Uneven human rhythm generator (avoids the mechanical even AI stagger tell)
  unevenStagger: (index, base = 0.08) => {
    const microOffsets = [0, 0.04, -0.02, 0.06, 0.01, 0.05];
    return base * index + (microOffsets[index % microOffsets.length] || 0);
  },

  // Purposeful hold before crucial reveals
  beatHold: 0.25,
};
