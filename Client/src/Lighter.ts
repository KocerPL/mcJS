import { Vector } from "./Engine/Utils/Vector.js";
import { World } from "./Game/World.js";

class LightNode
{
    x:number;
    y:number;
    z:number;
    light:number;
    constructor(x:number,y:number,z:number,light:number)
    {
        this.x=x;this.y=y;this.z=z;this.light =light;
    }
}
function hasNode(x:number,y:number,z:number,list:Array<LightNode>)
{
    for(const l of list)
    {
        if(l.x==x&& l.y==y&&l.z==z)
            return true;
    }
    return false;
}
export class Lighter
{
    static light(x:number,y:number,z:number,light:number)
    {
        console.log("start light");
        const list:Array<LightNode> = [];
        let firstNode=true;
        list.push(new LightNode(x,y,z,light));
        for(let i=0; list.length>i;i++)
        {
        
            const curLightNode = list[i];
            if(curLightNode.light<=0) continue;
            x=curLightNode.x;
            z=curLightNode.z;
            y=curLightNode.y;
            light=curLightNode.light;
            console.log("Lighting!!",x,",",y,",",z,);
            if(!firstNode &&    World.getBlock(new Vector(x,y,z)).id>0) continue;
            firstNode=false;
            World.getBlock(new Vector(x,y,z)).lightFBlock=curLightNode.light;
           

            let test=  World.getBlock(new Vector(x+1,y,z));
            if(test.lightFBlock+2<curLightNode.light && !hasNode(x+1,y,z,list))
            {
               // console.log("push!!!")
                list.push(new LightNode(x+1,y,z,light-1));
            }
            
            test=  World.getBlock(new Vector(x-1,y,z));
            if(test.lightFBlock+2<curLightNode.light && !hasNode(x-1,y,z,list))
            {
                //console.log("push!!!")
                list.push(new LightNode(x-1,y,z,light-1));
            }


            test=  World.getBlock(new Vector(x,y+1,z));
            if(test.lightFBlock+2<curLightNode.light && !hasNode(x,y+1,z,list))
            {
              //  console.log("push!!!")
                list.push(new LightNode(x,y+1,z,light-1));
            }
            
            test=  World.getBlock(new Vector(x,y-1,z));
            if(test.lightFBlock+2<curLightNode.light && !hasNode(x,y-1,z,list))
            {
                //console.log("push!!!")
                list.push(new LightNode(x,y-1,z,light-1));
            }
            
            test=  World.getBlock(new Vector(x,y,z+1));
            if(test.lightFBlock+2<curLightNode.light && !hasNode(x,y,z+1,list))
            {
                ////console.log("push!!!")
                list.push(new LightNode(x,y,z+1,light-1));
            }
            
            test=  World.getBlock(new Vector(x,y,z-1));
            if(test.lightFBlock+2<curLightNode.light && !hasNode(x,y,z-1,list))
            {
               //// console.log("push!!!")
                list.push(new LightNode(x,y,z-1,light-1));
            }
      
        }
        console.log("stop light")
    }
}