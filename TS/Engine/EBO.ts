import { CanvaManager } from "./CanvaManager.js";

let gl = CanvaManager.gl;
export class EBO
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
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(data),gl.STATIC_DRAW);
    }
    public bind():void
    {
      
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ID);
    }
    public get getID():WebGLBuffer
    {
        return this.ID;
    }
    public static unbind():void
    {
       gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);

    }
}