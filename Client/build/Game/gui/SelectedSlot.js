import { GuiComponent } from "./GuiComponent.js";
import { Texture } from "../../Engine/Texture.js";
import { Sprite } from "../../Engine/Utils/Sprite.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
export class SelectedSlot extends GuiComponent {
    constructor(x, y, id) {
        super(id);
        this.visible = true;
        this.sprite = new Sprite(-0.05, -0.05, 0.05, 0.05);
        this.transformation = Matrix3.identity().translate(x, y);
        this.tcoords = Texture.GUI.coords[2];
    }
    changePos(x, y) {
        this.transformation = Matrix3.identity().translate(x, y);
    }
}
