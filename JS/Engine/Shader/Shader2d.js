import { Shader } from "./Shader.js";
export class Shader2d extends Shader {
    constructor() {
        super("./JS/Engine/Shader/2d.vert", "./JS/Engine/Shader/2d.frag");
    }
    loadUniforms(prop, mult) {
        this.loadFloat("prop", prop);
        this.loadFloat("mult", mult);
        return;
    }
}
