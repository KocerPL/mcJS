import { CanvaManager } from "./CanvaManager.js";
let gl = CanvaManager.gl;
export class VAO
{
    private ID:WebGLVertexArrayObject;
    constructor()
    {
        this.ID =gl.createVertexArray();
        this.bind();
    }
    public addPtr(location:number,length:number,stride:number,offset:number):void
    {
        gl.vertexAttribPointer(location,length,gl.FLOAT,false,stride,offset);
        gl.enableVertexAttribArray(location);
    }
    public bind()
    {
        gl.bindVertexArray(this.ID);
    }
    public static unbind()
    {
        gl.bindVertexArray(0);
    }
}