import { CanvaManager } from "../CanvaManager.js";
import { Loader } from "../Loader.js";
import { Matrix4 } from "../Utils/Matrix4.js";
import { Vector } from "../Utils/Vector.js";
const gl = CanvaManager.gl;
export enum dimensions 
{
    _2d,
    _3d
}
export abstract class Shader
{
    protected dimensions;
    private locationCache:Map<string,WebGLUniformLocation>= new Map();
    private ID:WebGLShader;
    constructor(vertFile:string,fragFile:string)
    {
        this.dimensions =dimensions._3d;
        const vertCode = Loader.txtFile(vertFile); 
        const fragCode = Loader.txtFile(fragFile);
        const vert = gl.createShader(gl.VERTEX_SHADER);
        const frag = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(vert,vertCode);
        gl.shaderSource(frag,fragCode);
        gl.compileShader(vert);
        gl.compileShader(frag);

        
        if(gl.getShaderInfoLog(vert).length>0)
            console.log(gl.getShaderInfoLog(vert));
        if(gl.getShaderInfoLog(frag).length>0)
            console.log(gl.getShaderInfoLog(frag));
        this.ID = gl.createProgram();
        gl.attachShader(this.ID,vert);
        gl.attachShader(this.ID,frag);
        gl.linkProgram(this.ID);
        gl.useProgram(this.ID);
    }
    use()
    {
        if(Shader.current ==this) return;
        gl.useProgram(this.ID);
        Shader.current = this;
    }
    abstract loadUniforms(...args:any);
    loadMatrix(name:string,matrix:Matrix4)
    {
        gl.uniformMatrix4fv(this.getLocation(name),false,matrix.toFloat32Array());
    }
    loadFloat(name:string, float:number)
    {
        gl.uniform1f(this.getLocation(name),float);
    }
    loadVec3(name:string,vec:Vector)
    {
        gl.uniform3f(this.getLocation(name),vec.x,vec.y,vec.z);
    }
    loadVec4(name:string,vec:Vector)
    {
        gl.uniform4f(this.getLocation(name),vec.x,vec.y,vec.z,vec.w);
    }
    private getLocation(name:string):WebGLUniformLocation
    {
        if(this.locationCache.has(name))
            return this.locationCache.get(name);
        else
        {
            const loc =gl.getUniformLocation(this.ID,name);
            this.locationCache.set(name,loc);
            return loc;
        }
    }
    public getDim():dimensions
    {
        return this.dimensions;
    }
    public static current:Shader=null; 
}