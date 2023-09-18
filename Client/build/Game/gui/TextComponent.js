import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent.js";
import { CanvaManager } from "../../Engine/CanvaManager.js";
import { TextSprite } from "../../Engine/Utils/TextSprite.js";
const gl = CanvaManager.gl;
export class TextComponent extends GuiComponent {
    constructor(id) {
        super(id);
        this.sprite = new TextSprite(-0.5, -0.2, 0.5, 0.2, "TEST");
        this.visible = true;
        this.transformation = Matrix3.identity().translate(0, 0.5);
        this.tcoords = Texture.fontAtlas.coords[49];
    }
    renderItself(shader, mat) {
        Texture.fontAtlas.bind();
        shader.loadMatrix3("transformation", mat);
        if (this.renderMe)
            gl.drawElements(gl.TRIANGLES, this.vEnd - this.vStart, gl.UNSIGNED_INT, this.vStart * 4);
    }
}
