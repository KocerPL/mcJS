#version 300 es
precision highp float;
precision mediump sampler2DArray;
in vec4 pass_color;
out vec4 color;
uniform sampler2DArray tex;
void main()
{
    color=pass_color;
}