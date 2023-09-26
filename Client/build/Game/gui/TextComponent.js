import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent.js";
import { CanvaManager } from "../../Engine/CanvaManager.js";
import { TextSprite } from "../../Engine/Utils/TextSprite.js";
const gl = CanvaManager.gl;
export class TextComponent extends GuiComponent {
    constructor(id, text, w, h, align) {
        super(id);
        this.sprite = new TextSprite(-w, -(h ?? (w * 2)), w, (h ?? (w * 2)), text, align);
        this.visible = true;
        this.transformation = Matrix3.identity();
        this.tcoords = Texture.fontAtlas.coords[49];
    }
    renderItself(shader, mat) {
        Texture.fontAtlas.bind();
        shader.loadMatrix3("transformation", mat);
        if (this.renderMe)
            gl.drawElements(gl.TRIANGLES, this.vEnd - this.vStart, gl.UNSIGNED_INT, this.vStart * 4);
    }
    changeText(text) {
        if (this.sprite instanceof TextSprite)
            this.sprite.text = text;
        this.gui.needsRefresh();
    }
}
