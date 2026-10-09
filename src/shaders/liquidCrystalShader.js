import * as THREE from 'three';

export const LiquidCrystalShader = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uScrollSpeed: { value: 0 },
    uColor1: { value: new THREE.Color('#e2c992') }, // Champagne Gold
    uColor2: { value: new THREE.Color('#94a3b8') }, // Liquid Platinum Slate
    uDistortIntensity: { value: 0.14 },
    uFresnelPower: { value: 2.8 },
    uFresnelIntensity: { value: 1.8 },
    uRoughness: { value: 0.08 },
  },

  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform float uDistortIntensity;
    uniform float uScrollSpeed;
    uniform vec2 uMouse;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;
    varying float vDisplacement;
    varying float vFresnel;

    // Simplex 3D Noise GLSL helper
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z.xxxx);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;

      // Organic fluid distortion modulated by time and cursor
      float noiseVal = snoise(position * 1.2 + vec3(uTime * 0.4) + vec3(uMouse.x * 0.3, uMouse.y * 0.3, 0.0));
      float scrollFactor = 1.0 + min(abs(uScrollSpeed) * 2.0, 1.8);
      float displacement = noiseVal * uDistortIntensity * scrollFactor;
      vDisplacement = displacement;

      vec3 newPosition = position + normal * displacement;
      vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
      vViewPosition = -mvPosition.xyz;

      // Viewing vector and physical Fresnel rim
      vec3 viewDir = normalize(vViewPosition);
      vFresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.8);

      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: /* glsl */ `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uFresnelPower;
    uniform float uFresnelIntensity;
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;
    varying float vDisplacement;
    varying float vFresnel;

    void main() {
      vec3 viewDir = normalize(vViewPosition);
      vec3 normal = normalize(vNormal);

      // Subtle liquid metallic gradient
      float colorMix = sin(vDisplacement * 4.0 + uTime * 0.3) * 0.5 + 0.5;
      vec3 baseColor = mix(uColor1, uColor2, colorMix);

      // Studio key light specular highlight
      vec3 lightDir = normalize(vec3(0.8, 1.6, 1.2));
      vec3 halfVector = normalize(lightDir + viewDir);
      float NdotH = max(dot(normal, halfVector), 0.0);
      float specular = pow(NdotH, 64.0) * 1.5;

      // Studio rim light
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), uFresnelPower) * uFresnelIntensity;

      // Luxury platinum/champagne composition
      vec3 finalColor = baseColor * (0.4 + specular * 0.6) + (uColor1 * fresnel * 0.8);
      finalColor += vec3(specular * 0.9);

      gl_FragColor = vec4(finalColor, 0.95);
    }
  `,
};
