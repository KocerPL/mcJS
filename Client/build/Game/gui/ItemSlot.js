import { GuiComponent } from "./GuiComponent.js";
import { Texture } from "../../Engine/Texture.js";
import { Sprite } from "../../Engine/Utils/Sprite.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { ItemHolder } from "./ItemHolder.js";
export class ItemSlot extends GuiComponent {
    constructor(x, y, id) {
        super(id);
        this.visible = true;
        this.sprite = new Sprite(-0.05, -0.05, 0.05, 0.05);
        this.transformation = Matrix3.identity().translate(x, y);
        this.tcoords = Texture.GUI.coords[1];
        this.add(new ItemHolder(this.id + "_holder", 0.03));
    }
    update() {
        // const set = this.boundingBox.getRenderStuff(Texture.GUI.coords[1]);
        //this.rArrays.vertices = [];
        //this.rArrays.indices = set.indices;
        //this.rArrays.textureCoords = set.textureCoords;
        //for(let i =0;i<set.vertices.length;i+=2)
        //{
        //  const result:Vector3 = this.transformation.multiplyVec(new Vector3(set.vertices[i],set.vertices[i+1],1)); 
        //this.rArrays.vertices.push(result.x,result.y);
        //}
        //this.changed =true;
    }
}
