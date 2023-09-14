import { Shader, dimensions } from "./Shader.js";

export class Shader2d extends Shader
{
    constructor()
    {
        super("./res/shaders/2d.vert","./res/shaders/2d.frag");
        this.dimensions = dimensions._2d;
    }
    loadUniforms(prop:number) {
        this.loadFloat("prop",prop);
        return;
    }
}