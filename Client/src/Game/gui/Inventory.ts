import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent";

export class Inventory implements GuiComponent
{
    visible =true;
    changed:boolean;
    transformation: Matrix3;
    vertices: number[];
    textureCoords: number[];
    indices: number[];
    constructor()
    {
        this.textureCoords = [0,1,
                                1,1,
                                1,0,
                                0,0 ];
        this.vertices = [0,1,
                         1,1,
                         1,0,
                         0,0 ];
        this.indices = [0,1,2,2,1,0];
        this.update();
        this.transformation = Matrix3.identity();
    }
    update()
    {
        this.changed =true;
    }
}