import { CanvaManager } from "../CanvaManager.js";
import { Vector } from "../Utils/Vector.js";
import { Shader } from "./Shader.js";
let gl = CanvaManager.gl;
export class DefaultShader extends Shader {
    viewCenter = new Vector(0, 0, 0);
    fogDistance = 90;
    constructor() {
        super("/res/shaders/default.vert", "/res/shaders/default.frag");
    }
    loadUniforms(proj, transf, view, light) {
        this.loadMatrix("projection", proj);
        this.loadMatrix("transformation", transf);
        this.loadMatrix("view", view);
        this.loadFloat("light", light);
        this.loadFloat("fogDistance", this.fogDistance);
        this.loadVec3("center", this.viewCenter);
    }
    setFog(center, distance) {
        this.viewCenter = center;
        this.fogDistance = distance;
    }
    loadTransformation(transf) {
        this.loadMatrix("transformation", transf);
    }
}
