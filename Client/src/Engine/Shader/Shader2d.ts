import { Matrix3 } from "../Utils/Matrix3.js";
import { Vector4 } from "../Utils/Vector4.js";
import { Shader, dimensions } from "./Shader.js";

export class Shader2d extends Shader
{
    constructor()
    {
        super("./res/shaders/2d.vert","./res/shaders/2d.frag");
        this.dimensions = dimensions._2d;
    }
    loadUniforms(prop:number,depth:number, transformation:Matrix3,transparency?:number) {
        this.loadVec4("bgColor",new Vector4(0.0,0.0,0.0,0.0));
        this.loadFloat("depth",depth);
        this.loadFloat("prop",prop);
        this.loadFloat("transparency",transparency??1);
        this.loadMatrix3("transformation",transformation);
        return;
    }
}