import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { Vector3 } from "../../Engine/Utils/Vector3.js";
import { GuiComponent } from "./GuiComponent.js";

export class Inventory extends GuiComponent
{
    squareVertices: number[];
    constructor()
    {
        super();
        this.visible =true;
        this.transformation = Matrix3.identity().scale(0.02,0.02,0.02);
        let coords = Texture.GUI.coords;
        this.textureCoords = [
                                coords[0].dx,coords[0].y,
                                coords[0].x,coords[0].dy,
                                coords[0].dx,coords[0].dy,
                                coords[0].x,coords[0].y ];
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
        console.log("Works")
    }
}