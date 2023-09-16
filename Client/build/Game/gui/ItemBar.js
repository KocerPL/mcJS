import { Texture } from "../../Engine/Texture.js";
import { Sprite } from "../../Engine/Utils/Sprite.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent.js";
import { ItemSlot } from "./ItemSlot.js";
import { SelectedSlot } from "./SelectedSlot.js";
export class ItemBar extends GuiComponent {
    slot = new SelectedSlot(0, 0, "selected");
    currentSlot = 5;
    constructor(id) {
        super(id);
        this.visible = true;
        this.renderMe = false;
        this.sprite = new Sprite(-0.7, -0.05, 0.7, 0.05);
        this.transformation = Matrix3.identity().translate(0, -0.95);
        this.tcoords = Texture.GUI.coords[3];
        this.add(this.slot);
        this.add(new ItemSlot(0.4, 0, "slot_1"));
        this.add(new ItemSlot(0.3, 0, "slot_2"));
        this.add(new ItemSlot(0.2, 0, "slot_3"));
        this.add(new ItemSlot(0.1, 0, "slot_4"));
        this.add(new ItemSlot(0, 0, "slot_5"));
        this.add(new ItemSlot(-0.1, 0, "slot_6"));
        this.add(new ItemSlot(-0.2, 0, "slot_7"));
        this.add(new ItemSlot(-0.3, 0, "slot_8"));
        this.add(new ItemSlot(-0.4, 0, "slot_9"));
    }
    updateSlot() {
        this.slot.changePos(-0.4 + (0.1 * this.currentSlot), 0);
    }
}
