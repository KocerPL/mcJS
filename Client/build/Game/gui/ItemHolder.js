import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { Sprite } from "../../Engine/Utils/Sprite.js";
import { blocks } from "../Block.js";
import { GuiComponent } from "./GuiComponent.js";
const gl = CanvaManager.gl;
export class ItemHolder extends GuiComponent {
    constructor(id, size) {
        super(id);
        this.visible = true;
        this.sprite = new Sprite(-size, -size, size, size);
        this.tcoords = Texture.blockAtlas.coords[0];
        this.transformation = Matrix3.identity();
    }
    change(blockID) {
        this.tcoords = Texture.blockAtlas.coords[blocks[blockID].textureIndex.top];
        this.gui.needsRefresh();
    }
    renderItself(shader, mat) {
        Texture.blockAtlas.bind();
        shader.loadMatrix3("transformation", mat);
        if (this.renderMe)
            gl.drawElements(gl.TRIANGLES, this.vEnd - this.vStart, gl.UNSIGNED_INT, this.vStart * 4);
    }
}
