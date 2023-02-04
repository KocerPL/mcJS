#version 300 es
precision highp float;
uniform mat4 projection;
uniform mat4 transformation;
layout (location=1) in vec3 tcoord;
out vec3 pass_tc;
mat4 prepared;
uniform mat4 view;
uniform vec3 center;
layout(location = 0) in vec3 pos;
layout(location =2 ) in float light1;
layout(location =3 ) in float light2;
out float pass_Light;
out float cdistance;// Center distance
uniform float light;
//out vec3 pass_Normal;
//out vec3 FragPos;
void main()
{
   prepared = transformation*view*projection;
  
gl_Position =vec4(pos,1.0)*prepared;
 vec4 ready = vec4(pos,1.0)*transformation;
pass_Light = max(min(light1,light),light2) /15.0;
cdistance = length(center - ready.xyz);
 //FragPos = vec3(transformation * vec4(pos, 1.0));
 //pass_Normal = normal;
pass_tc=vec3(tcoord.x,tcoord.y,tcoord.z);

}