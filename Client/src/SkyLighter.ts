import { Vector4 } from "./Engine/Utils/Vector4.js";
import { Block, blockType } from "./Game/Block.js";
import { World } from "./Game/World.js";
import { GameScene } from "./Game/scenes/GameScene.js";
import { LightNode } from "./Lighter.js";

function hasNode(x:number,y:number,z:number,list:Array<LightNode>)
{
    for(const l of list)
    {
        if(l.x==x&& l.y==y&&l.z==z)
            return true;
    }
    return false;
}
export class SkyLighter
{
    static nodes:Array<LightNode> = [];
    static rmNodes:Array<LightNode> = [];
    static async processNode(gs:GameScene)
    {
        const node =this.nodes.shift();
        if(node)
            await this.light(node.x,node.y,node.z,node.light,gs);
        
        
        const rmnode =this.rmNodes.shift();
        if(rmnode)
            await this.removeLight(rmnode.x,rmnode.y,rmnode.z,rmnode.light,gs);
        
        await gs.occasionalSleeper();
        this.processNode(gs);
    }
    static async light(x:number,y:number,z:number,light:number,gs:GameScene)
    {
        const list:Array<LightNode> = [];
        let firstNode=true;
        list.push(new LightNode(x,y,z,light));
        for(let i=0; list.length>i;i++)
        {
            // await gs.occasionalSleeper();
            const curLightNode = list[i];
            if(curLightNode.light<=0) continue;
            x=curLightNode.x;
            z=curLightNode.z;
            y=curLightNode.y;
            light=curLightNode.light;
            if(!firstNode &&  Block.info[World.getBlock(curLightNode,gs).id].type==blockType.FULL) continue;
            firstNode=false;
            const d = World.getBlockAndSub(new Vector4(x,y,z),gs);
            d.block.skyLight = curLightNode.light;
            gs.toUpdate.add(d.sub);

            let test=  World.getBlock(new Vector4(x+1,y,z),gs);
            if(test && test.skyLight+1<curLightNode.light && !hasNode(x+1,y,z,list) && !hasNode(x+1,y,z,this.nodes))
            {
                list.push(new LightNode(x+1,y,z,light-1));
            }
            
            test=  World.getBlock(new Vector4(x-1,y,z),gs);
            if(test &&test.skyLight+1<curLightNode.light && !hasNode(x-1,y,z,list)&& !hasNode(x-1,y,z,this.nodes))
            {
                list.push(new LightNode(x-1,y,z,light-1));
            }


            test=  World.getBlock(new Vector4(x,y+1,z),gs);
            if(test &&test.skyLight+1<curLightNode.light && !hasNode(x,y+1,z,list)&& !hasNode(x,y+1,z,this.nodes))
            {
                list.push(new LightNode(x,y+1,z,light-1));
            }
            
            test=  World.getBlock(new Vector4(x,y-1,z),gs);
            if(test &&test.skyLight+1<curLightNode.light && !hasNode(x,y-1,z,list)&& !hasNode(x,y-1,z,this.nodes))
            {
                list.push(new LightNode(x,y-1,z,light-1));
            }
            
            test=  World.getBlock(new Vector4(x,y,z+1),gs);
            if(test &&test.skyLight+1<curLightNode.light && !hasNode(x,y,z+1,list)&& !hasNode(x,y,z+1,this.nodes))
            {
                list.push(new LightNode(x,y,z+1,light-1));
            }
            
            test=  World.getBlock(new Vector4(x,y,z-1),gs);
            if(test &&test.skyLight+1<curLightNode.light && !hasNode(x,y,z-1,list)&& !hasNode(x,y,z-1,this.nodes))
            {
                list.push(new LightNode(x,y,z-1,light-1));
            }
      
        }
    }
    static async removeLight(x:number,y:number,z:number,light:number,gs:GameScene)
    {

        const list:Array<LightNode> = [];
        let firstNode=true;
        list.push(new LightNode(x,y,z,light+1));
        for(let i=0; list.length>i;i++)
        {
            await gs.occasionalSleeper();
            const curLightNode = list[i];
            if(curLightNode.light<=0) continue;
            x=curLightNode.x;
            z=curLightNode.z;
            y=curLightNode.y;
            light=curLightNode.light;
            if(!firstNode &&    World.getBlock(curLightNode,gs).id>0) continue;
            firstNode=false;
           
            const d = World.getBlockAndSub(new Vector4(x,y,z),gs);
        
            d.block.skyLight = 0;
            gs.toUpdate.add(d.sub);

            let test=  World.getBlock(new Vector4(x+1,y,z),gs);
            if(test &&test.skyLight+1<curLightNode.light && !hasNode(x+1,y,z,list))
            {
                list.push(new LightNode(x+1,y,z,light-1));
            }
            
            test=  World.getBlock(new Vector4(x-1,y,z),gs);
            if(test &&test.skyLight+1<curLightNode.light && !hasNode(x-1,y,z,list))
            {
                list.push(new LightNode(x-1,y,z,light-1));
            }


            test=  World.getBlock(new Vector4(x,y+1,z),gs);
            if(test &&test.skyLight+1<curLightNode.light && !hasNode(x,y+1,z,list))
            {
                list.push(new LightNode(x,y+1,z,light-1));
            }
            
            test=  World.getBlock(new Vector4(x,y-1,z),gs);
            if(test &&test.skyLight+1<curLightNode.light && !hasNode(x,y-1,z,list))
            {
                list.push(new LightNode(x,y-1,z,light-1));
            }
            
            test=  World.getBlock(new Vector4(x,y,z+1),gs);
            if(test &&test.skyLight+1<curLightNode.light && !hasNode(x,y,z+1,list))
            {
                list.push(new LightNode(x,y,z+1,light-1));
            }
            
            test=  World.getBlock(new Vector4(x,y,z-1),gs);
            if(test &&test.skyLight+1<curLightNode.light && !hasNode(x,y,z-1,list))
            {
                list.push(new LightNode(x,y,z-1,light-1));
            }
      
        }
        for(let i=list.length-1; i>=0;i--)
        {
            await gs.occasionalSleeper();
            if(World.getBlock(list[i],gs).id<=0)
                this.processOneBlockLight(list[i].x,list[i].y,list[i].z,gs);
        }
    }
    static processOneBlockLight(x,y,z,gs:GameScene)
    {
       
        let light =0;
        let test = World.getBlock(new Vector4(x+1,y,z),gs);
        if(test && test.skyLight>light+1)
            light= test.skyLight-1;
        test = World.getBlock(new Vector4(x-1,y,z),gs);
        if(test && test.skyLight>light+1)
            light= test.skyLight-1;
        test = World.getBlock(new Vector4(x,y+1,z),gs);
        if(test && test.skyLight>light+1)
            light= test.skyLight-1;

        test = World.getBlock(new Vector4(x,y-1,z),gs);
        if(test && test.skyLight>light+1)
            light= test.skyLight-1;
        
        test = World.getBlock(new Vector4(x,y+1,z),gs);
        if(test && test.skyLight>light+1)
            light= test.skyLight-1;
        
        test = World.getBlock(new Vector4(x,y,z-1),gs);
        if(test && test.skyLight>light+1)
            light= test.skyLight-1;

        test = World.getBlock(new Vector4(x,y,z+1),gs);
        if(test && test.skyLight>light+1)
            light= test.skyLight-1;
        this.light(x,y,z,light,gs);

    }
}