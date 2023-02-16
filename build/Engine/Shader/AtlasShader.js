import { CanvaManager } from "../CanvaManager.js";
import { Shader } from "./Shader.js";
let gl = CanvaManager.gl;
export class AtlasShader extends Shader {
    constructor() {
        super("./res/shaders/atlas.vert", "./res/shaders/atlas.frag");
    }
    loadUniforms(proj, transf, view, light) {
        this.loadMatrix("projection", proj);
        this.loadMatrix("transformation", transf);
        this.loadMatrix("view", view);
        this.loadFloat("light", light);
    }
    loadTransformation(transf) {
        this.loadMatrix("transformation", transf);
    }
}
