#version 300 es
precision highp float;
precision mediump sampler2DArray;
in vec3 pass_tc;
out vec4 color;
//in vec3 FragPos;
//in vec3 pass_Normal;
uniform float fogDistance;
in float pass_Light;
//uniform vec3 lightPos;
uniform sampler2DArray tex;
in vec3 pass_center;
in vec3 pass_ready;
float cdistance;// Center distance
void main()
{
  cdistance = length(pass_center - pass_ready); // Distance from center calculation
  //  vec3 norm = normalize(pass_Normal);
//vec3 lightDir =normalize(lightPos - FragPos);  
//float diff = max(dot(norm, lightDir), 0.0);
//vec3 diffuse = diff *vec3(0.1,0.1,0.1);
vec3 ambient = vec3(0.3+(pass_Light*0.7),0.3+(pass_Light*0.7),0.3+(pass_Light*0.7));
vec4 texOk =  texture(tex,pass_tc);
    color=vec4(ambient,clamp((-cdistance+fogDistance)/10.0 ,0.0,1.0))*texOk;
}