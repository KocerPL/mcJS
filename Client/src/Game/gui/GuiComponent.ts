import { Matrix3 } from "../../Engine/Utils/Matrix3.js";


export interface GuiComponent
{
    visible:boolean;
    changed:boolean;
    transformation:Matrix3;
    vertices:Array<number>;
    textureCoords:Array<number>;
    indices:Array<number>;
}