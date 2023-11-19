import { Matrix4 } from "../Utils/Matrix4.js";
import { Vector4 } from "../Utils/Vector4.js";
import { Shader } from "./Shader.js";
export class DefaultShader extends Shader
{
    viewCenter:Vector4 = new Vector4(0,0,0);
    fogDistance=90;
    constructor()
    {
        super("./res/shaders/default.vert","./res/shaders/default.frag");
    }
    loadUniforms(proj:Matrix4,transf:Matrix4,view:Matrix4,light:number) {
        this.loadMatrix("projection",proj);
        this.loadMatrix("transformation",transf);  
        this.loadMatrix("view",view);
        this.loadFloat("light",light);
        this.loadFloat("fogDistance",this.fogDistance);
        this.loadVec3("center",this.viewCenter);
    }
    setFog(center:Vector4,distance:number)
    {
        this.viewCenter =center;
        this.fogDistance =distance;
    }
    loadTransformation(transf:Matrix4)
    {
        this.loadMatrix("transformation",transf);  
    }
}