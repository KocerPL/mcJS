#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec3 a_color;
out vec4 color;
void main() {
gl_Position = vec4(a_Position,1.0);
color = vec4(a_color,1.0);
}
