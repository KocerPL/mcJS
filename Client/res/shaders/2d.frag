#version 300 es
precision highp float;
in vec2 pass_tc;
out vec4 color;
uniform sampler2D tex;
uniform float transparency;
void main()
{
    vec4 texColor = texture(tex ,pass_tc);
    texColor.a*=transparency;
     if(texColor.a < 0.1)
        discard;
    color=texColor;
}