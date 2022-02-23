#version 300 es
precision highp float;
precision mediump sampler2DArray;
in vec2 pass_tc;
out vec4 color;
in vec3 FragPos;
in vec3 pass_Normal;
uniform vec3 lightPos;
uniform sampler2D tex;
void main()
{
    vec3 norm = normalize(pass_Normal);
vec3 lightDir =normalize(lightPos - FragPos);  
float diff = max(dot(norm, lightDir), 0.0);
vec3 diffuse = diff *vec3(0.1,0.1,0.1);
vec3 ambient = vec3(0.5,0.5,0.5);
    color=vec4(ambient,1.0)* texture(tex,pass_tc);
}