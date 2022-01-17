#version 300 es
precision highp float;
uniform mat4 projection;
uniform mat4 transformation;
//layout (location=1) in vec3 color;
out vec4 pass_color;
mat4 prepared ;
uniform mat4 view;
layout(location = 0) in vec3 pos;
void main()
{
   prepared = transformation*view*projection;
gl_Position = vec4(pos,1.0)*prepared;
pass_color=vec4(pos.x/16.0,pos.y/16.0,pos.z/16.0,1.0);
}