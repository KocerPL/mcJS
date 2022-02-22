import { CanvaManager } from "../CanvaManager.js";
import { Loader } from "../Loader.js";
import { Matrix } from "../Utils/Matrix.js";
import { Vector } from "../Utils/Vector.js";
let gl = CanvaManager.gl;
export abstract class Shader
{
    private ID:WebGLShader;
    constructor(vertFile:string,fragFile:string)
    {
     let vertCode = Loader.txtFile(vertFile); 
     let fragCode = Loader.txtFile(fragFile);
     let vert = gl.createShader(gl.VERTEX_SHADER);
     let frag = gl.createShader(gl.FRAGMENT_SHADER);
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
        gl.useProgram(this.ID);
    }
    abstract loadUniforms(...args:any);
    loadMatrix(name:string,matrix:Matrix)
    {
        let loc = gl.getUniformLocation(this.ID,name);
        gl.uniformMatrix4fv(loc,false,matrix.toFloat32Array());
    }
    loadFloat(name:string, float:number)
    {
        let loc = gl.getUniformLocation(this.ID,name);
        gl.uniform1f(loc,float);
    }
    loadVec4(name:string,vec:Vector)
    {
        let loc = gl.getUniformLocation(this.ID,name);
        gl.uniform4f(loc,vec.x,vec.y,vec.z,vec.w);
    }
}