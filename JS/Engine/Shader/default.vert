#version 300 es
precision highp float;
//projection matrix
uniform mat4 projection;
//transformation matrix
uniform mat4 transformation;
layout (location=1) in vec3 tcoord;
out vec3 pass_tc;
//View matrix
uniform mat4 view;
//Center(where camera stands)(for fog effect)
uniform vec3 center;
layout(location = 0) in vec3 pos;
layout(location =2 ) in float skylight;
layout(location =3 ) in float blocklight;
out float pass_Light; //Light ready to apply in fragment shader
out vec3 pass_center;
out vec3 pass_ready;
uniform float light; //Sun light level
//out vec3 pass_Normal;
//out vec3 FragPos;
void main()
{
   mat4 prepared = transformation*view*projection; // calculating 
gl_Position =vec4(pos,1.0)*prepared; // calculating position of vertex
 vec4 ready = vec4(pos,1.0)*transformation; // Calculating matrix for fog
 float act =max(min(skylight,light),blocklight) /15.0; //Calculating light level
pass_Light = act - (act/5.0); //Calculating final light
pass_center = center;
pass_ready = ready.xyz;
 //FragPos = vec3(transformation * vec4(pos, 1.0));
 //pass_Normal = normal;
pass_tc=tcoord;
}