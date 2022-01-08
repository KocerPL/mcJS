export class VBO
{
    constructor(gl)
    {
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
    }
    bufferData(gl,data)
    {
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
    }
    bind(gl)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
    }
    unbind(gl)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER,null)
    }
}