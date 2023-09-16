import { Shader, dimensions } from "./Shader.js";
export class Shader2d extends Shader {
    constructor() {
        super("./res/shaders/2d.vert", "./res/shaders/2d.frag");
        this.dimensions = dimensions._2d;
    }
    loadUniforms(prop, depth, transformation) {
        this.loadFloat("depth", depth);
        this.loadFloat("prop", prop);
        this.loadMatrix3("transformation", transformation);
        return;
    }
}
