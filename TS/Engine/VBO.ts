import { CanvaManager } from "./CanvaManager.js";

export class VBO
{
    private ID:WebGLBuffer;
    public constructor()
    {
        let gl = CanvaManager.gl;
        this.ID =gl.createBuffer();
        this.bind();
    }
    public bufferData(data):void
    {
        let gl = CanvaManager.gl;
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
    }
    public bind():void
    {
        let gl= CanvaManager.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.ID);
    }
    public get getID():WebGLBuffer
    {
        return this.ID;
    }
    public static unbind():void
    {
        let gl= CanvaManager.gl;
       gl.bindBuffer(gl.ARRAY_BUFFER,null)


    }
}