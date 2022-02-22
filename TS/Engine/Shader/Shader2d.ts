import { Shader } from "./Shader.js";

export class Shader2d extends Shader
{
    constructor()
    {
        super("/JS/Engine/Shader/2d.vert","/JS/Engine/Shader/2d.frag");
    }
    loadUniforms(prop) {
        this.loadFloat("prop",prop);
        return;
    }
}