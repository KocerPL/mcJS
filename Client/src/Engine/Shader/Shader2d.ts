import { Matrix3 } from "../Utils/Matrix3.js";
import { Shader, dimensions } from "./Shader.js";

export class Shader2d extends Shader
{
    constructor()
    {
        super("./res/shaders/2d.vert","./res/shaders/2d.frag");
        this.dimensions = dimensions._2d;
    }
    loadUniforms(prop:number,transformation:Matrix3) {
        this.loadFloat("prop",prop);
        this.loadMatrix3("transformation",transformation)
        return;
    }
}