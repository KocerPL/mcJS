export class Pencil
{
    constructor(canva)
    {
        this.gl = canva.gl; 
    }
    clear(r,g,b)
    {
        let gl = this.gl;
        gl.clearColor(r,g,b,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}