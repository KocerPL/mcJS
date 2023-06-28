import { Vector } from "./Engine/Utils/Vector.js";
import { World } from "./Game/World.js";
import { Main } from "./Main.js";

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
    toVector():Vector
    {
        return new Vector(this.x,this.y,this.z);
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
            const d = World.getBlockAndSub(new Vector(x,y,z));
            Main.toUpdate.add(d.sub);
            if(!firstNode &&   d.block.id>0) continue;
            firstNode=false;
           
            d.block.lightFBlock = curLightNode.light;
          

            let test=  World.getBlock(new Vector(x+1,y,z));
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x+1,y,z,list))
            {
                list.push(new LightNode(x+1,y,z,light-1));
            }
            
            test=  World.getBlock(new Vector(x-1,y,z));
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x-1,y,z,list))
            {
                list.push(new LightNode(x-1,y,z,light-1));
            }


            test=  World.getBlock(new Vector(x,y+1,z));
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x,y+1,z,list))
            {
                list.push(new LightNode(x,y+1,z,light-1));
            }
            
            test=  World.getBlock(new Vector(x,y-1,z));
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x,y-1,z,list))
            {
                list.push(new LightNode(x,y-1,z,light-1));
            }
            
            test=  World.getBlock(new Vector(x,y,z+1));
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x,y,z+1,list))
            {
                list.push(new LightNode(x,y,z+1,light-1));
            }
            
            test=  World.getBlock(new Vector(x,y,z-1));
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x,y,z-1,list))
            {
                list.push(new LightNode(x,y,z-1,light-1));
            }
      
        }
    }
    static removeLight(x:number,y:number,z:number,light:number)
    {

        const list:Array<LightNode> = [];
        let firstNode=true;
        list.push(new LightNode(x,y,z,light+2));
        for(let i=0; list.length>i;i++)
        {
        
            const curLightNode = list[i];
            if(curLightNode.light<=0) continue;
            x=curLightNode.x;
            z=curLightNode.z;
            y=curLightNode.y;
            light=curLightNode.light;
            const d = World.getBlockAndSub(new Vector(x,y,z));
            Main.toUpdate.add(d.sub);
            if(!firstNode &&    d.block.id>0) continue;
            firstNode=false;
           
           
        
            d.block.lightFBlock = 0;
           

            let test=  World.getBlock(new Vector(x+1,y,z));
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x+1,y,z,list))
            {
                list.push(new LightNode(x+1,y,z,light-1));
            }
            
            test=  World.getBlock(new Vector(x-1,y,z));
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x-1,y,z,list))
            {
                list.push(new LightNode(x-1,y,z,light-1));
            }


            test=  World.getBlock(new Vector(x,y+1,z));
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x,y+1,z,list))
            {
                list.push(new LightNode(x,y+1,z,light-1));
            }
            
            test=  World.getBlock(new Vector(x,y-1,z));
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x,y-1,z,list))
            {
                list.push(new LightNode(x,y-1,z,light-1));
            }
            
            test=  World.getBlock(new Vector(x,y,z+1));
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x,y,z+1,list))
            {
                list.push(new LightNode(x,y,z+1,light-1));
            }
            
            test=  World.getBlock(new Vector(x,y,z-1));
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x,y,z-1,list))
            {
                list.push(new LightNode(x,y,z-1,light-1));
            }
      
        }
        for(let i=list.length-1; i>=0;i--)
        {
            if(World.getBlock(list[i].toVector()).id<=0)
                this.processOneBlockLight(list[i].x,list[i].y,list[i].z);
        }
    }
    static processOneBlockLight(x,y,z)
    {
       
        let light =0;
        let test = World.getBlock(new Vector(x+1,y,z));
        if(test.lightFBlock>light+1)
            light= test.lightFBlock-1;
        test = World.getBlock(new Vector(x-1,y,z));
        if(test.lightFBlock>light+1)
            light= test.lightFBlock-1;
        test = World.getBlock(new Vector(x,y+1,z));
        if(test.lightFBlock>light+1)
            light= test.lightFBlock-1;

        test = World.getBlock(new Vector(x,y-1,z));
        if(test.lightFBlock>light+1)
            light= test.lightFBlock-1;
        
        test = World.getBlock(new Vector(x,y+1,z));
        if(test.lightFBlock>light+1)
            light= test.lightFBlock-1;
        
        test = World.getBlock(new Vector(x,y,z-1));
        if(test.lightFBlock>light+1)
            light= test.lightFBlock-1;

        test = World.getBlock(new Vector(x,y,z+1));
        if(test.lightFBlock>light+1)
            light= test.lightFBlock-1;
        this.light(x,y,z,light);

    }
}