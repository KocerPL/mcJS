import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent.js";
import { ItemSlot } from "./ItemSlot.js";
import { BorderedSprite } from "../../Engine/Utils/BorderedSprite.js";
export class Inventory extends GuiComponent {
    // slot = new SelectedSlot(0,0,"selected");
    currentSlot = 5;
    constructor(id) {
        super(id);
        this.visible = true;
        this.renderMe = true;
        this.sprite = new BorderedSprite(-0.475, -0.475, 0.475, 0.175, 0.025, Texture.GUI.coords[3], Texture.GUI.coords[4], Texture.GUI.coords[5], Texture.GUI.coords[6], Texture.GUI.coords[7], Texture.GUI.coords[8], Texture.GUI.coords[9], Texture.GUI.coords[10], Texture.GUI.coords[11]);
        this.transformation = Matrix3.identity(); //.translate(0,-0.925);
        this.tcoords = Texture.GUI.coords[3];
        //this.add(new TextComponent("ActionBar","NONE",0.01,null,ALIGN.center)).transformation = Matrix3.identity().translate(0.0,0.15);
        let i = 1;
        for (let y = -0.1; y <= 0.1; y += 0.1)
            for (let x = -0.4; x <= 0.4; x += 0.1) {
                this.add(new ItemSlot(x, y - 0.3, "invSlot_" + i));
                i++;
            }
        // this.add(this.slot);
    }
    renderItself(shader, mat) {
        //shader.loadFloat("depth",-0.9);
        super.renderItself(shader, mat);
    }
}
