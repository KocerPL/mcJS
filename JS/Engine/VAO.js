export class VAO
{
constructor(gl)
{
    this.vertexArray = gl.createVertexArray();
    gl.bindVertexArray(this.vertexArray);
}
bind(gl)
{
    gl.bindVertexArray(this.vertexArray);
}
unbind(gl)
{
    gl.bindVertexArray(null);
}
addAttribPointer(gl,location,length,stride,offset)
{
    gl.vertexAttribPointer(location,length,gl.FLOAT,false,stride*Float32Array.BYTES_PER_ELEMENT,offset*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(location);
}
}