#version 300 es
precision highp float;
layout(location = 0) in vec2 pos;
layout(location=1) in vec2 tCoords;
layout(location=2) in float index;
out vec2 pass_tc;
out float pass_index; 
uniform float prop; 
void main()
{
gl_Position = vec4(pos.x*prop , pos.y,-1.0,1.0);
pass_tc = vec2(tCoords.x,tCoords.y);
pass_index=index;
}