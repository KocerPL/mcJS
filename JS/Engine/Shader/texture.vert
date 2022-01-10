#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec2 a_texCoord;
uniform mat4 transformation;
uniform mat4 projection;
uniform mat4 view;
out vec2 v_texCoord;
mat4 ready;
vec4 posDiv;
void main() {

ready =transformation*view*projection;

//The graphics card has +10 iq with opengl and does division for us
gl_Position = vec4(a_Position,1.0)*ready;
v_texCoord = a_texCoord;
}