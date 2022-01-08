export class EBO
{
    constructor(gl)
    {
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.buffer);
    }
    bufferData(gl,data)
    {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Int32Array(data),gl.STATIC_DRAW);
    }
    bind(gl)
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.buffer);
    }
    unbind(gl)
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null)
    }
}