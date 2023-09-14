import { RenderArrays } from "../../Engine/RenderArrays.js";
import { Texture } from "../../Engine/Texture.js";
import { BoundingBox } from "../../Engine/Utils/BoundingBox.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { Vector3 } from "../../Engine/Utils/Vector3.js";
import { rot2d } from "../Models.js";


export abstract class GuiComponent
{
    protected boundingBox:BoundingBox;
    protected components:GuiComponent[]=[];
    renderMe:boolean=true;
   protected visible:boolean;
   rArrays:RenderArrays = new RenderArrays();
    changed:boolean=true;
    transformation:Matrix3;
    tcoords:{x:number,y:number,dx:number,dy:number,rotation: rot2d};
    set setVisible(visible: boolean)
    {
        this.changed = true;
        this.visible = visible;
    }
    get getVisible()
    {
        return this.visible;
    }
    updateComponents()
    {
        let index=0;
        this.rArrays.resetArrays();
        if(this.renderMe)
        {
        let set = this.boundingBox.getRenderStuff(this.tcoords);
        for(let i =0;i<set.vertices.length;i+=2)
        {
            let result:Vector3 = this.transformation.multiplyVec(new Vector3(set.vertices[i],set.vertices[i+1],1)); 
            this.rArrays.vertices.push(result.x,result.y);
        }
            let highest = 0;
            for(let i=0;i<set.indices.length;i++)
            {
                if(set.indices[i]+index>highest) highest = set.indices[i]+index;
            this.rArrays.indices.push(set.indices[i]+index);
            }
            index = highest+1;
            this.rArrays.textureCoords.push(...set.textureCoords)
        }
        for(const comp of this.components)
        {
            comp.changed=false;
            if(!comp.getVisible) continue;
            for(let i =0;i<comp.rArrays.vertices.length;i+=2)
            {
            let result:Vector3 = this.transformation.multiplyVec(new Vector3(comp.rArrays.vertices[i],comp.rArrays.vertices[i+1],1)); 
            this.rArrays.vertices.push(result.x,result.y);
            }
            let highest = 0;
            for(let i=0;i<comp.rArrays.indices.length;i++)
            {
                if(comp.rArrays.indices[i]+index>highest) highest = comp.rArrays.indices[i]+index;
            this.rArrays.indices.push(comp.rArrays.indices[i]+index);
            }
            index = highest+1;
            this.rArrays.textureCoords.push(...comp.rArrays.textureCoords);
        }
        this.changed =true;
    }
    add(component:GuiComponent)
    {
        this.components.push(component);
    }
}