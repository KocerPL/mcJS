import { CanvaManager } from "./CanvaManager.js";
const gl= CanvaManager.gl;
export class VBO
{
    private ID:WebGLBuffer;
    public constructor()
    {
        this.ID =gl.createBuffer();
        this.bind();
    }
    public bufferData(data):void
    {
        this.bind();
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
    }
    public bind():void
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.ID);
    }
    public get getID():WebGLBuffer
    {
        return this.ID;
    }
    public static unbind():void
    {  
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
    }
    static delete(vbo:VBO)
    {
        gl.deleteBuffer(vbo.ID);
    }
}