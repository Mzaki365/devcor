/**
 * Star Solutions - Master 3D & Animation Config
 * Central tuning parameters for shaders, particles, lighting, and quality tiers.
 */

export const EXPERIENCE_CONFIG = {
  // Quality Tiers (Auto-detected or manually toggled)
  qualityTiers: {
    high: {
      dpr: [1, 1.5],
      particleCount: 3200,
      bloomIntensity: 1.25,
      chromaticAberration: true,
      godRays: true,
      liquidDistortion: true,
      hdrEnvironment: true,
    },
    medium: {
      dpr: 1.0,
      particleCount: 1800,
      bloomIntensity: 0.9,
      chromaticAberration: false,
      godRays: true,
      liquidDistortion: true,
      hdrEnvironment: false,
    },
    low: {
      dpr: 1.0,
      particleCount: 800,
      bloomIntensity: 0.6,
      chromaticAberration: false,
      godRays: false,
      liquidDistortion: false,
      hdrEnvironment: false,
    },
  },

  // Tier 1: Liquid Mercury / Crystal Shader Parameters
  liquidShader: {
    noiseSpeed: 0.85,
    noiseFrequency: 1.4,
    distortionStrength: 0.22,
    fresnelPower: 2.2,
    fresnelIntensity: 1.8,
    transmission: 0.92,
    roughness: 0.12,
    chromaticSplit: 0.04,
  },

  // Tier 1: Volumetric God Rays
  godRays: {
    rayCount: 4,
    rayLength: 6.5,
    rayRadius: 1.8,
    opacity: 0.35,
    rotationSpeed: 0.2,
  },

  // Tier 1: Section Transition Shader
  sectionTransition: {
    duration: 0.8,
    waveFrequency: 8.0,
    waveAmplitude: 0.15,
  },
};
