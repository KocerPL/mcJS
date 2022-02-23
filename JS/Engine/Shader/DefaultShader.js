import { CanvaManager } from "../CanvaManager.js";
import { Shader } from "./Shader.js";
let gl = CanvaManager.gl;
export class DefaultShader extends Shader {
    constructor() {
        super("/JS/Engine/Shader/default.vert", "/JS/Engine/Shader/default.frag");
    }
    loadUniforms(proj, transf, view, lightPos) {
        this.loadMatrix("projection", proj);
        this.loadMatrix("transformation", transf);
        this.loadMatrix("view", view);
        this.loadVec3("lightPos", lightPos);
    }
}
