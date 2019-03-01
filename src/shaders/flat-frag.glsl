#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;

in vec2 fs_Pos;
out vec4 out_Col;

struct Ray {
  vec3 origin;
  vec3 direction;
};

float hash3D(vec3 x) {
	float i = dot(x, vec3(123.4031, 46.5244876, 91.106168));
	return fract(sin(i * 7.13) * 268573.103291);
}

// 3D noise
float noise(vec3 p) {
  vec3 bCorner = floor(p);
  vec3 inCell = fract(p);

  float bLL = hash3D(bCorner);
  float bUL = hash3D(bCorner + vec3(0.0, 0.0, 1.0));
  float bLR = hash3D(bCorner + vec3(0.0, 1.0, 0.0));
  float bUR = hash3D(bCorner + vec3(0.0, 1.0, 1.0));
  float b0 = mix(bLL, bUL, inCell.z);
  float b1 = mix(bLR, bUR, inCell.z);
  float b = mix(b0, b1, inCell.y);

  vec3 fCorner = bCorner + vec3(1.0, 0.0, 0.0);
  float fLL = hash3D(fCorner);
  float fUL = hash3D(fCorner + vec3(0.0, 0.0, 1.0));
  float fLR = hash3D(fCorner + vec3(0.0, 1.0, 0.0));
  float fUR = hash3D(fCorner + vec3(0.0, 1.0, 1.0));
  float f0 = mix(fLL, fUL, inCell.z);
  float f1 = mix(fLR, fUR, inCell.z);
  float f = mix(f0, f1, inCell.y);

  return mix(b, f, inCell.x);
}

float fbm(vec3 q, int n) {
  float acc = 0.0;
  float freqScale = 2.0;
  float invScale = 1.0 / freqScale;
  float freq = 1.0;
  float amp = 1.0;

  for (int i = 0; i < n; ++i) {
    freq *= freqScale;
    amp *= invScale;
    acc += noise(q * freq) * amp;
  }
  return acc;
}

float starFBM(vec3 q) {
  float acc = 0.0;
  float amp = 1.0;
  float maxAmp = 0.0;

  for (int i = 0; i < 3; ++i) {
    maxAmp += amp;
    acc += noise(q) * amp;
    amp *= 0.5;
    q *= 2.0;
  }
  return 1.2 * acc / maxAmp;
}

vec4 galaxy(vec3 p) {
  float star1 = starFBM(p * 5.7);
  float star2 = starFBM(p + vec3(1.27, 6.298, 4.243));
  float star3 = starFBM(p + vec3(0.23, 0.45, 0.67) * 5.0 + 0.005 * sin(0.05 * u_Time));
  float starTotal = star1 * star2 * star3 * 3.0;

  float falloff = 0.55;
  float noiseThreshold = 1.9;

  starTotal = clamp(starTotal - noiseThreshold + falloff, 0.0, 1.0);

  float weight = starTotal / (7.0 * falloff);
  return vec4(18.0 * weight * vec3(star1 * 0.2, star2 * 0.5, star3 * 0.8), 1.0);
}

void main() {
  out_Col = galaxy(vec3(fs_Pos, 1.0) * (0.1 * fbm(vec3(0.000012 * u_Time), 2) + 1.0) * 90.0);
}
