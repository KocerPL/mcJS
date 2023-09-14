import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { Vector3 } from "../../Engine/Utils/Vector3.js";
import { GuiComponent } from "./GuiComponent.js"

export class ItemBar extends GuiComponent
{
    squareVertices:Array<number>;
    constructor()
    {
        super();
        this.visible =true;
        this.transformation = Matrix3.identity().scale(0.05,0.05,0.05).translate(0,-19);
        let coords = Texture.GUI.coords;
        this.textureCoords = [
            coords[1].dx,coords[1].y,
            coords[1].x,coords[1].dy,
            coords[1].dx,coords[1].dy,
            coords[1].x,coords[1].y ];
this.squareVertices = [1,-1,
     -1,1,
     1,1,
     -1,-1];
     this.indices = [0,1,2,1,0,3];
            this.update();
    }
    update()
    {
        this.vertices = [];
        for(let i =0;i<this.squareVertices.length;i+=2)
        {
            let result:Vector3 = this.transformation.multiplyVec(new Vector3(this.squareVertices[i],this.squareVertices[i+1],1)); 
        this.vertices.push(result.x,result.y);
        }
        this.changed =true;
    }
}