#version 300 es
precision highp float;
in vec4 pass_color;
out vec4 color;
void main()
{
    color= pass_color;
}