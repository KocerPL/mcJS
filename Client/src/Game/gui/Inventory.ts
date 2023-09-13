import { Matrix4 } from "../../Engine/Utils/Matrix4";
import { GuiComponent } from "./GuiComponent";

class Inventory implements GuiComponent
{
    visible =true;
    changed:boolean;
    transformation: Matrix4;
    vertices: number[];
    textureCoords: number[];
    skyLight: number[];
    blockLight: number[];
    indices: number[];
    constructor()
    {
        this.transformation = Matrix4.identity();
    }
}