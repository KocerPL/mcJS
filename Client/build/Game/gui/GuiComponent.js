import { CanvaManager } from "../../Engine/CanvaManager.js";
import { RenderArrays } from "../../Engine/RenderArrays.js";
import { Texture } from "../../Engine/Texture.js";
import { Vector3 } from "../../Engine/Utils/Vector3.js";
const gl = CanvaManager.gl;
export class GuiComponent {
    sprite;
    components = [];
    renderMe = true;
    visible;
    gui;
    changed = true;
    id;
    vStart = 0;
    vEnd = 0;
    parent = null;
    transformation;
    tcoords;
    constructor(id) {
        this.id = id;
    }
    set setVisible(visible) {
        this.changed = true;
        this.visible = visible;
    }
    get getVisible() {
        return this.visible;
    }
    updateComponents(vStart) {
        let index = 0;
        const rArrays = new RenderArrays();
        rArrays.resetArrays();
        for (const comp of this.components) {
            comp.changed = false;
            const subRArrays = comp.updateComponents(vStart + rArrays.indices.length);
            for (let i = 0; i < subRArrays.vertices.length; i += 2) {
                //const result:Vector3 = this.transformation.multiplyVec(new Vector3(subRArrays.vertices[i],subRArrays.vertices[i+1],1)); 
                rArrays.vertices.push(subRArrays.vertices[i], subRArrays.vertices[i + 1]);
            }
            let highest = 0;
            for (let i = 0; i < subRArrays.indices.length; i++) {
                if (subRArrays.indices[i] + index > highest)
                    highest = subRArrays.indices[i] + index;
                rArrays.indices.push(subRArrays.indices[i] + index);
            }
            index = highest + 1;
            rArrays.textureCoords.push(...subRArrays.textureCoords);
        }
        if (this.renderMe) {
            const set = this.sprite.getRenderArrays(this.tcoords);
            this.vStart = vStart + rArrays.indices.length;
            for (let i = 0; i < set.vertices.length; i += 2) {
                const result = this.transformation.multiplyVec(new Vector3(set.vertices[i], set.vertices[i + 1], 1));
                rArrays.vertices.push(set.vertices[i], set.vertices[i + 1]);
            }
            let highest = 0;
            for (let i = 0; i < set.indices.length; i++) {
                if (set.indices[i] + index > highest)
                    highest = set.indices[i] + index;
                rArrays.indices.push(set.indices[i] + index);
            }
            this.vEnd = vStart + rArrays.indices.length;
            index = highest + 1;
            rArrays.textureCoords.push(...set.textureCoords);
        }
        console.log(this.id, "=", this.vStart, "|||", this.vEnd);
        return rArrays;
    }
    add(component) {
        this.components.push(component);
        component.gui = this.gui;
        if (this.gui)
            this.gui.needsRefresh();
        component.parent = this;
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
    render(shader, transf) {
        if (!this.visible)
            return;
        const mat = transf.multiplyMat(this.transformation); //.multiplyMat(transf);
        for (const comp of this.components)
            comp.render(shader, mat);
        this.renderItself(shader, mat);
    }
    attachGUI(gui) {
        this.gui = gui;
        for (const comp of this.components)
            comp.attachGUI(gui);
    }
    renderItself(shader, mat) {
        Texture.GUI.bind();
        shader.loadMatrix3("transformation", mat);
        if (this.renderMe)
            gl.drawElements(gl.TRIANGLES, this.vEnd - this.vStart, gl.UNSIGNED_INT, this.vStart * 4);
    }
}
