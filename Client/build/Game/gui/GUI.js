import { CanvaManager } from "../../Engine/CanvaManager.js";
import { RenderSet } from "../../Engine/RenderSet.js";
import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
const gl = CanvaManager.gl;
export class GUI {
    components = [];
    renderSet;
    needRefresh = false;
    constructor(shader) {
        this.renderSet = new RenderSet(shader);
    }
    render() {
        if (this.needRefresh) {
            this.refresh();
            this.needRefresh = false;
        }
        Texture.GUI.bind();
        this.renderSet.shader.use();
        this.renderSet.vao.bind();
        this.renderSet.shader.loadUniforms(CanvaManager.getProportion, -1, Matrix3.identity());
        for (const comp of this.components) {
            comp.render(this.renderSet.shader, Matrix3.identity());
        }
        //   gl.drawElements(gl.TRIANGLES,this.renderSet.count,gl.UNSIGNED_INT,0);
    }
    add(component) {
        this.components.push(component);
        component.attachGUI(this);
        this.needsRefresh();
        return component;
    }
    needsRefresh() {
        this.needRefresh = true;
    }
    refresh() {
        let index = 0;
        this.renderSet.resetArrays();
        for (const comp of this.components) {
            if (!comp.getVisible)
                continue;
            let highest = 0;
            let subRArrays = comp.updateComponents(this.renderSet.indices.length);
            this.renderSet.vertices.push(...subRArrays.vertices);
            for (let i = 0; i < subRArrays.indices.length; i++) {
                if (subRArrays.indices[i] + index > highest)
                    highest = subRArrays.indices[i] + index;
                this.renderSet.indices.push(subRArrays.indices[i] + index);
            }
            index = highest + 1;
            this.renderSet.textureCoords.push(...subRArrays.textureCoords);
        }
        this.renderSet.bufferArrays();
        console.log(this.renderSet.vertices);
    }
    get(id) {
        for (const comp of this.components)
            if (comp.id == id)
                return comp;
            else {
                const test = comp.get(id);
                if (test)
                    return test;
            }
    }
}
