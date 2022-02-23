import { CanvaManager } from "../CanvaManager.js";
import { Matrix } from "../Utils/Matrix.js";
import { Vector } from "../Utils/Vector.js";
import { Shader } from "./Shader.js";
let gl = CanvaManager.gl;
export class DefaultShader extends Shader
{
    constructor()
    {
        super("/JS/Engine/Shader/default.vert","/JS/Engine/Shader/default.frag");
    }
    loadUniforms(proj:Matrix,transf:Matrix,view:Matrix,lightPos:Vector) {
        this.loadMatrix("projection",proj);
        this.loadMatrix("transformation",transf);  
        this.loadMatrix("view",view);
        this.loadVec3("lightPos",lightPos);
    }
}