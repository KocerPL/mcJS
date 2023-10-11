import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent.js";
import { CanvaManager } from "../../Engine/CanvaManager.js";
import { TextSprite } from "../../Engine/Utils/TextSprite.js";
const gl = CanvaManager.gl;
export class TextInput extends GuiComponent {
    text;
    time = 0;
    selected = true;
    cursor = false;
    constructor(id, text, w, h, align) {
        super(id);
        this.sprite = new TextSprite(-w, -(h ?? (w * 2)), w, (h ?? (w * 2)), text, align);
        this.text = text;
        this.visible = true;
        this.transformation = Matrix3.identity();
        this.tcoords = Texture.fontAtlas.coords[49];
        this.onkey = (key) => {
            if (!this.selected)
                return;
            if (key.length == 1)
                this.text += key;
            else if (key == "Backspace")
                this.text = this.text.substring(0, this.text.length - 1);
            this.changeText(this.text);
        };
    }
    renderItself(shader, mat) {
        Texture.fontAtlas.bind();
        if (this.selected) {
            const now = Date.now();
            if (now - this.time > 500) {
                this.time = now;
                if (this.sprite instanceof TextSprite)
                    if (this.cursor)
                        this.sprite.text = this.text + "_";
                    else
                        this.sprite.text = this.text + " ";
                this.cursor = !this.cursor;
                this.gui.needsRefresh();
            }
        }
        shader.loadMatrix3("transformation", mat);
        if (this.renderMe)
            gl.drawElements(gl.TRIANGLES, this.vEnd - this.vStart, gl.UNSIGNED_INT, this.vStart * 4);
    }
    changeText(text) {
        //  if(text==""){ this.renderMe = false; return;}
        this.text = text;
        this.renderMe = true;
        if (this.sprite instanceof TextSprite)
            this.sprite.text = text + " ";
        this.gui.needsRefresh();
    }
}
