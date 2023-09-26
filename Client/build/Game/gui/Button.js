import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent.js";
import { BorderedSprite } from "../../Engine/Utils/BorderedSprite.js";
import { TextComponent } from "./TextComponent.js";
import { ALIGN } from "../../Engine/Utils/TextSprite.js";
export class Button extends GuiComponent {
    onclick = () => { };
    boundingBox;
    constructor(id) {
        super(id);
        this.add(new TextComponent(id + "_text", "", 0.03, null, ALIGN.center));
        this.sprite = new BorderedSprite(-0.475, -0.075, 0.475, 0.075, 0.025, Texture.GUI.coords[3], Texture.GUI.coords[4], Texture.GUI.coords[5], Texture.GUI.coords[6], Texture.GUI.coords[7], Texture.GUI.coords[8], Texture.GUI.coords[9], Texture.GUI.coords[10], Texture.GUI.coords[11]);
        this.visible = true;
        this.transformation = Matrix3.identity();
        this.tcoords = Texture.GUI.coords[0];
        this.boundingBox = { x: -0.475, y: -0.075, dx: 0.475, dy: 0.075 };
    }
    changeText(text) {
        let t = this.get(this.id + "_text");
        if (t instanceof TextComponent)
            t.changeText(text);
    }
}
