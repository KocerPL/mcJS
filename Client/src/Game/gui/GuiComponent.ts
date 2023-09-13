import { Matrix4 } from "../../Engine/Utils/Matrix4.js";


export interface GuiComponent
{
    visible:boolean;
    changed:boolean;
    transformation:Matrix4;
    vertices:Array<number>;
    textureCoords:Array<number>;
    skyLight:Array<number>;
    blockLight:Array<number>;
    indices:Array<number>;
}