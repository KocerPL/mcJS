#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec3 a_color;
uniform mat4 transformation;
uniform mat4 projection;
uniform mat4 view;
out vec4 color;
vec4 posDiv;
void main() {
if(a_Position.z == 0.0)
{
posDiv = (vec4(a_Position.x,a_Position.y,a_Position.z,1.0)*transformation)*view*projection;
posDiv = vec4(posDiv.x,posDiv.y,posDiv.z,posDiv.w);
}
else
{
posDiv = (vec4(a_Position,1.0)*transformation)*view *projection;
//The graphics card has +10 iq with opengl and does division for us
}
gl_Position = vec4(posDiv);
color = vec4(a_color,1.0);
}
