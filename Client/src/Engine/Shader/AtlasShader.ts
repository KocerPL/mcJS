import { CanvaManager } from "../CanvaManager.js";
import { Matrix4 } from "../Utils/Matrix4.js";
import { Vector } from "../Utils/Vector.js";
import { Shader } from "./Shader.js";
export class AtlasShader extends Shader
{
    
    constructor()
    {
        super("./res/shaders/atlas.vert","./res/shaders/atlas.frag");
    }
    loadUniforms(proj:Matrix4,transf:Matrix4,view:Matrix4,light:number) {
        this.loadMatrix("projection",proj);
        this.loadMatrix("transformation",transf);  
        this.loadMatrix("view",view);
        this.loadFloat("light",light);
    }
    loadTransformation(transf:Matrix4)
    {
        this.loadMatrix("transformation",transf);  
    }
}