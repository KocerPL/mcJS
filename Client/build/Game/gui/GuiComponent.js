import { RenderArrays } from "../../Engine/RenderArrays.js";
import { Vector3 } from "../../Engine/Utils/Vector3.js";
export class GuiComponent {
    boundingBox;
    components = [];
    renderMe = true;
    visible;
    rArrays = new RenderArrays();
    changed = true;
    id;
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
    updateComponents() {
        let index = 0;
        this.rArrays.resetArrays();
        for (const comp of this.components) {
            comp.changed = false;
            if (!comp.getVisible)
                continue;
            for (let i = 0; i < comp.rArrays.vertices.length; i += 2) {
                const result = this.transformation.multiplyVec(new Vector3(comp.rArrays.vertices[i], comp.rArrays.vertices[i + 1], 1));
                this.rArrays.vertices.push(result.x, result.y);
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
            for (let i = 0; i < set.vertices.length; i += 2) {
                const result = this.transformation.multiplyVec(new Vector3(set.vertices[i], set.vertices[i + 1], 1));
                this.rArrays.vertices.push(result.x, result.y);
            }
            let highest = 0;
            for (let i = 0; i < set.indices.length; i++) {
                if (set.indices[i] + index > highest)
                    highest = set.indices[i] + index;
                this.rArrays.indices.push(set.indices[i] + index);
            }
            index = highest + 1;
            this.rArrays.textureCoords.push(...set.textureCoords);
        }
        this.changed = true;
        if (this.parent)
            this.parent.refresh();
    }
    refresh() {
        for (const comp of this.components) {
            if (comp.changed)
                this.updateComponents();
        }
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
}
