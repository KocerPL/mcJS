import { Texture } from "../../Engine/Texture.js";
import { Sprite } from "../../Engine/Utils/Sprite.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent.js";

export class Button extends GuiComponent
{

    constructor(id:string)
    {
        super(id);
        this.sprite = new Sprite(-0.02,-0.02,0.02,0.02);
        this.visible =true;
        this.transformation = Matrix3.identity();
        this.tcoords = Texture.GUI.coords[0];
      
    }
}