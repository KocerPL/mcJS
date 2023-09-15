import { Texture } from "../../Engine/Texture.js";
import { BoundingBox } from "../../Engine/Utils/BoundingBox.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { Vector3 } from "../../Engine/Utils/Vector3.js";
import { GuiComponent } from "./GuiComponent.js";

export class Inventory extends GuiComponent
{

    constructor(id:string)
    {
        super(id);
        this.boundingBox = new BoundingBox(-0.02,-0.02,0.02,0.02);
        this.visible =true;
        this.transformation = Matrix3.identity();
        this.tcoords = Texture.GUI.coords[0];
      
    }
}