import { CanvaManager } from "../CanvaManager.js";
import { Vector } from "../Utils/Vector.js";
import { Shader } from "./Shader.js";
let gl = CanvaManager.gl;
export class DefaultShader extends Shader {
    viewCenter = new Vector(0, 0, 0);
    constructor() {
        super("./JS/Engine/Shader/default.vert", "./JS/Engine/Shader/default.frag");
    }
    loadUniforms(proj, transf, view, light) {
        this.loadMatrix("projection", proj);
        this.loadMatrix("transformation", transf);
        this.loadMatrix("view", view);
        this.loadFloat("light", light);
        this.loadVec3("center", this.viewCenter);
    }
    setFogCenter(center) {
        this.viewCenter = center;
    }
    loadTransformation(transf) {
        this.loadMatrix("transformation", transf);
    }
}
