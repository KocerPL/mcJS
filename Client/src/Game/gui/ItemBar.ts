import { Texture } from "../../Engine/Texture.js";
import { Sprite } from "../../Engine/Utils/Sprite.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent.js";
import { ItemSlot } from "./ItemSlot.js";
import { SelectedSlot } from "./SelectedSlot.js";
import { Shader } from "../../Engine/Shader/Shader.js";
import { BorderedSprite } from "../../Engine/Utils/BorderedSprite.js";
import { TextComponent } from "./TextComponent.js";
export class ItemBar extends GuiComponent
{
    slot = new SelectedSlot(0,0,"selected");
    currentSlot = 5;
    constructor(id:string)
    {
        super(id);
        this.visible =true;
        this.renderMe = true;
        this.sprite = new BorderedSprite(-0.475,-0.075,0.475,0.075,0.025,Texture.GUI.coords[3],Texture.GUI.coords[4],Texture.GUI.coords[5],Texture.GUI.coords[6],Texture.GUI.coords[7],Texture.GUI.coords[8],Texture.GUI.coords[9],Texture.GUI.coords[10],Texture.GUI.coords[11]);
        this.transformation = Matrix3.identity().translate(0,-0.925);
        this.tcoords = Texture.GUI.coords[3];
        this.add(new TextComponent("TEXT"));
        this.add(this.slot);
        this.add(new ItemSlot(-0.4,0,"slot_1"));
        this.add(new ItemSlot(-0.3,0,"slot_2"));
        this.add(new ItemSlot(-0.2,0,"slot_3"));
        this.add(new ItemSlot(-0.1,0,"slot_4"));
        this.add(new ItemSlot(0,0,"slot_5"));
        this.add(new ItemSlot(0.1,0,"slot_6"));
        this.add(new ItemSlot(0.2,0,"slot_7"));
        this.add(new ItemSlot(0.3,0,"slot_8"));
        this.add(new ItemSlot(0.4,0,"slot_9"));
    
    }
    updateSlot()
    {
        this.slot.changePos(-0.4+(0.1*this.currentSlot),0);
    }
    renderItself(shader: Shader, mat: Matrix3): void {
        shader.loadFloat("depth",-0.9);
        super.renderItself(shader,mat);
    }
}