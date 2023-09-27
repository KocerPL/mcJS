import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { Sprite } from "../../Engine/Utils/Sprite.js";
import { ALIGN } from "../../Engine/Utils/TextSprite.js";
import { Block, blockType, Side } from "../Block.js";
import { GuiComponent } from "./GuiComponent.js";
import { TextComponent } from "./TextComponent.js";
const gl = CanvaManager.gl;
export class ItemHolder extends GuiComponent {
    size;
    blockID = 0;
    constructor(id, size) {
        super(id);
        this.size = size;
        this.visible = false;
        this.sprite = new Sprite(-size, -size, size, size);
        this.tcoords = Texture.blockAtlas.coords[0];
        this.transformation = Matrix3.identity();
        let tComp = this.add(new TextComponent(this.id + "_text", "64", 0.01, 0.02, ALIGN.right));
        tComp.transformation = tComp.transformation.translate(0.03, -0.03);
    }
    change(blockID, count) {
        this.blockID = blockID;
        if (blockID == 0) {
            this.visible = false;
            return;
        }
        this.visible = true;
        let tComp = this.get(this.id + "_text");
        if (tComp instanceof TextComponent)
            tComp.changeText(`${count}`);
        if (Block.info[blockID].type == blockType.NOTFULL)
            this.sprite.dy = 0;
        this.tcoords = Texture.blockAtlas.coords[Block.info[blockID].textureIndex[Side.front]];
        this.gui.needsRefresh();
    }
    renderItself(shader, mat) {
        Texture.blockAtlas.bind();
        shader.loadMatrix3("transformation", mat);
        if (this.renderMe)
            gl.drawElements(gl.TRIANGLES, this.vEnd - this.vStart, gl.UNSIGNED_INT, this.vStart * 4);
    }
}
