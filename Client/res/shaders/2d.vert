#version 300 es
precision highp float;
layout(location = 0) in vec2 pos;
layout(location=1) in vec2 tCoords;
out vec2 pass_tc;
uniform mat3 transformation;
uniform float prop;
uniform float depth;
void main()
{
vec3 result =vec3(pos.x, pos.y,1.0)*transformation;
gl_Position = vec4(result.x*prop,result.y,depth,1.0);
pass_tc = vec2(tCoords.x,tCoords.y);
}