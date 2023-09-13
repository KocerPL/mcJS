import { CanvaManager } from "../../Engine/CanvaManager.js";
import { RenderSet } from "../../Engine/RenderSet.js";
const gl = CanvaManager.gl;
export class GUI {
    components = [];
    renderSet;
    constructor(shader) {
        this.renderSet = new RenderSet(shader);
    }
    render() {
        for (const comp of this.components) {
            if (comp.visible && comp.changed)
                this.refresh();
        }
        this.renderSet.shader.use();
        this.renderSet.vao.bind();
        gl.drawElements(gl.TRIANGLES, this.renderSet.count, gl.UNSIGNED_INT, 0);
        console.log("Rendering");
    }
    add(component) {
        this.components.push(component);
    }
    refresh() {
        this.renderSet.resetArrays();
        for (const comp of this.components) {
            comp.changed = false;
            if (!comp.visible)
                continue;
            this.renderSet.vertices.push(...comp.vertices);
            this.renderSet.indices.push(...comp.indices);
            this.renderSet.textureCoords.push(...comp.textureCoords);
        }
        this.renderSet.bufferArrays();
    }
}
