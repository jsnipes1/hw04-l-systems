#version 300 es

uniform mat4 u_ViewProj;
uniform float u_Time;

uniform mat3 u_CameraAxes; // Used for rendering particles as billboards (quads that are always looking at the camera)
// gl_Position = center + vs_Pos.x * camRight + vs_Pos.y * camUp;

in vec4 vs_Pos; // Non-instanced; each particle is the same quad drawn in a different place
in vec4 vs_Nor; // Non-instanced, and presently unused
in vec4 vs_Col; // An instanced rendering attribute; each particle instance has a different color
in vec3 vs_Translate; // Another instance rendering attribute used to position each quad instance in the scene
in vec2 vs_UV; // Non-instanced, and presently unused in main(). Feel free to use it for your meshes.
in vec4 vs_Rotate;
in vec3 vs_Scale;

out vec4 fs_Col;
out vec4 fs_Pos;
out vec4 fs_Nor;

void main()
{
    fs_Col = vs_Col;
    fs_Pos = vs_Pos;
    fs_Nor = vs_Nor;

    vec3 offset = vs_Translate;

    vec4 q = vs_Rotate;
    float s = 1.0 / (length(q) * length(q));
    mat3 r = mat3(1.0 - 2.0 * s * (q[1] * q[1] + q[2] * q[2]), 2.0 * s * (q[0] * q[1] + q[2] * q[3]), 2.0 * s * (q[0] * q[2] - q[1] * q[3]),
                  2.0 * s * (q[0] * q[1] - q[2] * q[3]), 1.0 - 2.0 * s * (q[0] * q[0] + q[2] * q[2]), 2.0 * s * (q[1] * q[2] + q[0] * q[3]),
                  2.0 * s * (q[0] * q[2] + q[1] * q[3]), 2.0 * s * (q[1] * q[2] - q[0] * q[3]), 1.0 - 2.0 * s * (q[0] * q[0] + q[1] * q[1]));
    
    mat3 sc = mat3(1.0);
    sc[0][0] = vs_Scale[0];
    sc[1][1] = vs_Scale[1];
    sc[2][2] = vs_Scale[2];

    offset = sc * (r * vs_Pos.xyz) + offset;
    // offset.z = (sin((u_Time + offset.x) * 3.14159 * 0.1) + cos((u_Time + offset.y) * 3.14159 * 0.1)) * 1.5;

    // vec3 billboardPos = offset + vs_Pos.x * u_CameraAxes[0] + vs_Pos.y * u_CameraAxes[1];

    gl_Position = u_ViewProj * (vs_Pos + vec4(offset, 1.0));
}
