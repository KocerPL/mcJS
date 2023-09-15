import { CanvaManager } from "../../Engine/CanvaManager.js";
import { RenderArrays } from "../../Engine/RenderArrays.js";
import { Vector3 } from "../../Engine/Utils/Vector3.js";
const gl = CanvaManager.gl;
export class GuiComponent {
    boundingBox;
    components = [];
    renderMe = true;
    visible;
    rArrays = new RenderArrays();
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
        this.rArrays.resetArrays();
        for (const comp of this.components) {
            comp.changed = false;
            if (!comp.getVisible)
                continue;
            comp.updateComponents(vStart + this.rArrays.indices.length);
            for (let i = 0; i < comp.rArrays.vertices.length; i += 2) {
                //const result:Vector3 = this.transformation.multiplyVec(new Vector3(comp.rArrays.vertices[i],comp.rArrays.vertices[i+1],1)); 
                this.rArrays.vertices.push(comp.rArrays.vertices[i], comp.rArrays.vertices[i + 1]);
            }
            let highest = 0;
            for (let i = 0; i < comp.rArrays.indices.length; i++) {
                if (comp.rArrays.indices[i] + index > highest)
                    highest = comp.rArrays.indices[i] + index;
                this.rArrays.indices.push(comp.rArrays.indices[i] + index);
            }
            index = highest + 1;
            this.rArrays.textureCoords.push(...comp.rArrays.textureCoords);
        }
        if (this.renderMe) {
            const set = this.boundingBox.getRenderStuff(this.tcoords);
            this.vStart = vStart + this.rArrays.indices.length;
            for (let i = 0; i < set.vertices.length; i += 2) {
                const result = this.transformation.multiplyVec(new Vector3(set.vertices[i], set.vertices[i + 1], 1));
                this.rArrays.vertices.push(set.vertices[i], set.vertices[i + 1]);
            }
            let highest = 0;
            for (let i = 0; i < set.indices.length; i++) {
                if (set.indices[i] + index > highest)
                    highest = set.indices[i] + index;
                this.rArrays.indices.push(set.indices[i] + index);
            }
            this.vEnd = vStart + this.rArrays.indices.length;
            index = highest + 1;
            this.rArrays.textureCoords.push(...set.textureCoords);
        }
        console.log(this.id, "=", this.vStart, "|||", this.vEnd);
    }
    refresh() {
    }
    add(component) {
        this.components.push(component);
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
        let mat = transf.multiplyMat(this.transformation); //.multiplyMat(transf);
        shader.loadMatrix3("transformation", mat);
        for (const comp of this.components)
            comp.render(shader, mat);
        if (this.renderMe)
            gl.drawElements(gl.TRIANGLES, this.vEnd - this.vStart, gl.UNSIGNED_INT, this.vStart * 4);
    }
}
