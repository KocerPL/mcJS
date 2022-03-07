#version 300 es
precision highp float;
precision mediump sampler2DArray;
in vec2 pass_tc;
out vec4 color;
in float pass_index;
uniform sampler2DArray tex;
void main()
{
    color=texture(tex ,vec3(pass_tc,pass_index));
}