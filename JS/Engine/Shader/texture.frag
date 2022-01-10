#version 300 es
precision highp float;
 
// Passed in from the vertex shader.
in vec2 v_texCoord;
 
// The texture.
uniform sampler2D u_texture;
 
out vec4 outColor;
 
void main() {
  outColor = texture(u_texture, v_texCoord);
//outColor = vec4(0,0,1,1);
}