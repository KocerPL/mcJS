import { Vector3 } from "./Engine/Utils/Vector3.js";
import { Block, blockType } from "./Game/Block.js";
import { World } from "./Game/World.js";
import { GameScene } from "./Game/scenes/GameScene.js";

class LightNode extends Vector3
{
    light:number;
    constructor(x:number,y:number,z:number,light:number)
    {
        super(x,y,z);
        this.light =light;
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
    static async light(x:number,y:number,z:number,light:number,gs:GameScene)
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
            const d = World.getBlockAndSub(curLightNode,gs);
            gs.toUpdate.add(d.sub);
            if(!firstNode &&   Block.info[d.block.id].type==blockType.FULL) continue;
            firstNode=false;
           
            d.block.lightFBlock = curLightNode.light;
          

            let test=  World.getBlock(new Vector3(x+1,y,z),gs);
            if(test&& test.lightFBlock+1<curLightNode.light && !hasNode(x+1,y,z,list))
            {
                list.push(new LightNode(x+1,y,z,light-1));
            }
            
            test=  World.getBlock(new Vector3(x-1,y,z),gs);
            if(test&&test.lightFBlock+1<curLightNode.light && !hasNode(x-1,y,z,list))
            {
                list.push(new LightNode(x-1,y,z,light-1));
            }


            test=  World.getBlock(new Vector3(x,y+1,z),gs);
            if(test&&test.lightFBlock+1<curLightNode.light && !hasNode(x,y+1,z,list))
            {
                list.push(new LightNode(x,y+1,z,light-1));
            }
            
            test=  World.getBlock(new Vector3(x,y-1,z),gs);
            if(test&&test.lightFBlock+1<curLightNode.light && !hasNode(x,y-1,z,list))
            {
                list.push(new LightNode(x,y-1,z,light-1));
            }
            
            test=  World.getBlock(new Vector3(x,y,z+1),gs);
            if(test&&test.lightFBlock+1<curLightNode.light && !hasNode(x,y,z+1,list))
            {
                list.push(new LightNode(x,y,z+1,light-1));
            }
            
            test=  World.getBlock(new Vector3(x,y,z-1),gs);
            if(test&&test.lightFBlock+1<curLightNode.light && !hasNode(x,y,z-1,list))
            {
                list.push(new LightNode(x,y,z-1,light-1));
            }
      
        }
    }
    static async removeLight(x:number,y:number,z:number,light:number,gs:GameScene)
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
            const d = World.getBlockAndSub(curLightNode,gs);
            gs.toUpdate.add(d.sub);
            if(!firstNode &&    d.block.id>0) continue;
            firstNode=false;
           
           
        
            d.block.lightFBlock = 0;
           

            let test=  World.getBlock(new Vector3(x+1,y,z),gs);
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x+1,y,z,list))
            {
                list.push(new LightNode(x+1,y,z,light-1));
            }
            
            test=  World.getBlock(new Vector3(x-1,y,z),gs);
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x-1,y,z,list))
            {
                list.push(new LightNode(x-1,y,z,light-1));
            }


            test=  World.getBlock(new Vector3(x,y+1,z),gs);
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x,y+1,z,list))
            {
                list.push(new LightNode(x,y+1,z,light-1));
            }
            
            test=  World.getBlock(new Vector3(x,y-1,z),gs);
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x,y-1,z,list))
            {
                list.push(new LightNode(x,y-1,z,light-1));
            }
            
            test=  World.getBlock(new Vector3(x,y,z+1),gs);
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x,y,z+1,list))
            {
                list.push(new LightNode(x,y,z+1,light-1));
            }
            
            test=  World.getBlock(new Vector3(x,y,z-1),gs);
            if(test.lightFBlock+1<curLightNode.light && !hasNode(x,y,z-1,list))
            {
                list.push(new LightNode(x,y,z-1,light-1));
            }
      
        }
        for(let i=list.length-1; i>=0;i--)
        {
            if(World.getBlock(list[i],gs).id<=0)
                await this.processOneBlockLight(list[i].x,list[i].y,list[i].z,gs);
        }
    }
    static async processOneBlockLight(x,y,z,gs:GameScene)
    {
       
        let light =0;
        let test = World.getBlock(new Vector3(x+1,y,z),gs);
        if(test.lightFBlock>light+1)
            light= test.lightFBlock-1;
        test = World.getBlock(new Vector3(x-1,y,z),gs);
        if(test.lightFBlock>light+1)
            light= test.lightFBlock-1;
        test = World.getBlock(new Vector3(x,y+1,z),gs);
        if(test.lightFBlock>light+1)
            light= test.lightFBlock-1;

        test = World.getBlock(new Vector3(x,y-1,z),gs);
        if(test.lightFBlock>light+1)
            light= test.lightFBlock-1;
        
        test = World.getBlock(new Vector3(x,y+1,z),gs);
        if(test.lightFBlock>light+1)
            light= test.lightFBlock-1;
        
        test = World.getBlock(new Vector3(x,y,z-1),gs);
        if(test.lightFBlock>light+1)
            light= test.lightFBlock-1;

        test = World.getBlock(new Vector3(x,y,z+1),gs);
        if(test.lightFBlock>light+1)
            light= test.lightFBlock-1;
        await this.light(x,y,z,light,gs);

    }
}
const occasionalSleeper = (function() {
    //
    let lastSleepingTime = performance.now();

    return function() {
        if (performance.now() - lastSleepingTime > 100) {
            lastSleepingTime = performance.now();
            return new Promise(resolve => setTimeout(resolve, 0));
        } else {
            return Promise.resolve();
        }
    };
}());