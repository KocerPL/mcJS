import { Texture } from "../../Engine/Texture.js";
import { BoundingBox } from "../../Engine/Utils/BoundingBox.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { Vector3 } from "../../Engine/Utils/Vector3.js";
import { GuiComponent } from "./GuiComponent.js"
import { ItemSlot } from "./ItemSlot.js";

export class ItemBar extends GuiComponent
{
    constructor()
    {
        super();
        this.visible =true;
        this.renderMe = false;
        this.boundingBox = new BoundingBox(-0.4,-0.05,0.4,0.05);
        this.transformation = Matrix3.identity().translate(0,-0.95);
        this.tcoords = Texture.GUI.coords[1];
     this.rArrays.indices = [0,1,2,1,0,3];
     this.add(new ItemSlot(0.4,0));
     this.add(new ItemSlot(0.3,0));
     this.add(new ItemSlot(0.2,0));
     this.add(new ItemSlot(0.1,0));
     this.add(new ItemSlot(0,0));
     this.add(new ItemSlot(-0.1,0));
     this.add(new ItemSlot(-0.2,0));
     this.add(new ItemSlot(-0.3,0));
     this.add(new ItemSlot(-0.4,0));
    
            this.update();
    }
    update()
    {
        this.updateComponents();
      
    }
}