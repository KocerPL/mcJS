import { Matrix3 } from "../../Engine/Utils/Matrix3.js";


export class GuiComponent
{
   protected visible:boolean;
    changed:boolean;
    transformation:Matrix3;
    vertices:Array<number>;
    textureCoords:Array<number>;
    indices:Array<number>;
    set setVisible(visible: boolean)
    {
        this.changed = true;
        this.visible = visible;
    }
    get getVisible()
    {
        return this.visible;
    }
}