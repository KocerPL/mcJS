import { CanvaManager } from "../CanvaManager.js";
import { Matrix } from "../Utils/Matrix.js";
import { Vector } from "../Utils/Vector.js";
import { Shader } from "./Shader.js";
let gl = CanvaManager.gl;
export class DefaultShader extends Shader
{
    viewCenter:Vector = new Vector(0,0,0);
    fogDistance:number=90;
    constructor()
    {
        super("./JS/Engine/Shader/default.vert","./JS/Engine/Shader/default.frag");
    }
    loadUniforms(proj:Matrix,transf:Matrix,view:Matrix,light:number) {
        this.loadMatrix("projection",proj);
        this.loadMatrix("transformation",transf);  
        this.loadMatrix("view",view);
        this.loadFloat("light",light);
        this.loadFloat("fogDistance",this.fogDistance);
        this.loadVec3("center",this.viewCenter);
    }
    setFog(center:Vector,distance:number)
    {
       this.viewCenter =center;
       this.fogDistance =distance;
    }
    loadTransformation(transf:Matrix)
    {
        this.loadMatrix("transformation",transf);  
    }
}