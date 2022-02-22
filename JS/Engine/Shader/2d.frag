#version 300 es
precision highp float;
precision mediump sampler2DArray;
in vec2 pass_tc;
out vec4 color;
uniform sampler2D tex;
void main()
{
    color=texture(tex,pass_tc);
}