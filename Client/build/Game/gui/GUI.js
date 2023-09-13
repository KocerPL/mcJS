import { CanvaManager } from "../../Engine/CanvaManager.js";
import { RenderSet } from "../../Engine/RenderSet.js";
const gl = CanvaManager.gl;
export class GUI {
    components = [];
    renderSet;
    shader;
    constructor(shader) {
        this.shader = shader;
        this.renderSet = new RenderSet(shader);
    }
    render() {
        for (const comp of this.components) {
            if (comp.visible && comp.changed)
                this.refresh();
        }
        this.shader.use();
    }
    add(component) {
        this.components.push(component);
    }
    refresh() {
        for (const comp of this.components) {
            comp.changed = false;
            if (!comp.visible)
                continue;
            this.renderSet.vertices.push(...comp.vertices);
            this.renderSet.indices.push(...comp.indices);
            this.renderSet.textureCoords.push(...comp.textureCoords);
        }
    }
}
