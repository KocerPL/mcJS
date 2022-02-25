#version 300 es
precision highp float;
uniform mat4 projection;
uniform mat4 transformation;
layout (location=1) in vec2 tcoord;
out vec2 pass_tc;
mat4 prepared;
uniform mat4 view;
layout(location = 0) in vec3 pos;
layout(location =2 ) in float light;
out float pass_Light;
//out vec3 pass_Normal;
//out vec3 FragPos;
void main()
{
   prepared = transformation*view*projection;
gl_Position = vec4(pos,1.0)*prepared;
pass_Light =light/15.0;
 //FragPos = vec3(transformation * vec4(pos, 1.0));
 //pass_Normal = normal;
pass_tc=vec2(tcoord.x/64.0,tcoord.y/64.0);
}