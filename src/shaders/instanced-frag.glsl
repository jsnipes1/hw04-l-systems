#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;
in vec4 fs_Nor;

out vec4 out_Col;

vec4 lambert(vec4 lights[3], vec3 lightColors[3], vec3 p, vec3 baseColor) {
  vec3 sumColor = vec3(0.0);
  vec3 nHat = fs_Nor.xyz;

  for (int i = 0; i < 3; ++i) {
    vec3 lHat = normalize(lights[i].xyz - p);
    vec3 lamb = baseColor * clamp(dot(nHat, lHat), 0.0, 1.0) * lights[i].w * lightColors[i];
    sumColor += lamb;
  }

  // Return average color
  sumColor /= 3.0;
  return vec4(sumColor, 1.0);
}

void main()
{
    vec4 lights[3];
    lights[0] = vec4(6.0, 3.0, 5.0, 3.0); // key light
    lights[1] = vec4(-6.0, 3.0, 5.0, 2.5); // fill light
	lights[2] = vec4(6.0, 5.0, -1.75, 4.0); // back light

    vec3 lightColors[3];
    lightColors[0] = vec3(0.8, 0.2, 0.3);
    lightColors[1] = vec3(0.1, 0.7, 0.5);
    lightColors[2] = vec3(0.3, 0.4, 0.8);

    out_Col = lambert(lights, lightColors, fs_Pos.xyz, fs_Col.xyz);

    float dist = 1.0 - (length(fs_Pos.xyz) * 2.0);
    // out_Col = vec4(dist) * fs_Col;
    out_Col = fs_Col;
}
