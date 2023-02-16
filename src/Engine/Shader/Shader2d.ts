import { Shader } from "./Shader.js";

export class Shader2d extends Shader
{
    constructor()
    {
        super("/res/shaders/2d.vert","/res/shaders/2d.frag");
    }
    loadUniforms(prop,mult:number) {
        this.loadFloat("prop",prop);
        this.loadFloat("mult",mult);
        return;
    }
}