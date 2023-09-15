import { GuiComponent } from "./GuiComponent.js";
import { Texture } from "../../Engine/Texture.js";
import { BoundingBox } from "../../Engine/Utils/BoundingBox.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { Vector3 } from "../../Engine/Utils/Vector3.js";
export class SelectedSlot extends GuiComponent
{
    constructor(x:number,y:number,id:string)
    {
        super(id);
        this.visible =true;
        this.boundingBox = new BoundingBox(-0.05,-0.05,0.05,0.05);
        this.transformation = Matrix3.identity().translate(x,y);
        this.tcoords = Texture.GUI.coords[2];
    }
    changePos(x:number,y:number)
    {
        this.transformation = Matrix3.identity().translate(x,y);
    }
}