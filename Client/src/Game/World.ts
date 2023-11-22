import { Vector3 } from "../Engine/Utils/Vector3.js";
import { Vector4 } from "../Engine/Utils/Vector4.js";
import { Lighter } from "../Lighter.js";
import { SkyLighter } from "../SkyLighter.js";
import { Block } from "./Block.js";
import { Chunk } from "./Chunk.js";
import { SubChunk } from "./SubChunk.js";
import { GameScene } from "./scenes/GameScene.js";
export class World
{
    private Chunks:Array<Array<Chunk>> = [];
    public static waterLevel = 0;
    public static height=50;
    public static setBlockNoLight(blockPos:Vector4,type:number,gs:GameScene)
    {
        const inChunkPos:Vector4 = new Vector4(Math.round(Math.round(blockPos.x)%16),Math.round(blockPos.y),Math.round(Math.round(blockPos.z)%16));
        if(inChunkPos.x<0)
            inChunkPos.x = 16-Math.abs(inChunkPos.x);
        if(inChunkPos.z<0)
            inChunkPos.z = 16-Math.abs(inChunkPos.z);

        const chunkPos =new Vector4(Math.floor(Math.round(blockPos.x)/16),Math.round(blockPos.y),Math.floor(Math.round(blockPos.z)/16));
        try
        {
            const chunk = gs.getChunkAt(chunkPos.x,chunkPos.z);
            chunk.setBlock(inChunkPos,type,gs);
        }
        catch(error)
        {
          
            //  console.error(error);
            return;
        }
    }
    public static  getHeightMap(blockPos:Vector4,gs:GameScene):number
    {
        const chunkPos =new Vector4(Math.floor(Math.round(blockPos.x)/16),Math.round(blockPos.y),Math.floor(Math.round(blockPos.z)/16));
        const inChunkPos = new Vector4(Math.round(blockPos.x)%16,Math.round(blockPos.y),Math.round(blockPos.z)%16);
        if(inChunkPos.x<0)
            inChunkPos.x = 16-Math.abs(inChunkPos.x);
        if(inChunkPos.z<0)
            inChunkPos.z = 16-Math.abs(inChunkPos.z);
        try
        {
            return  gs.getChunkAt(chunkPos.x,chunkPos.z).heightmap[inChunkPos.x][inChunkPos.z];
        } 
        catch(error)
        {
            return undefined;
        }
    }
    public static getSubchunk(blockPos:Vector4,gs:GameScene)
    {
        const chunkPos =new Vector4(Math.floor(Math.round(blockPos.x)/16),Math.round(blockPos.y),Math.floor(Math.round(blockPos.z)/16));

        try
        {
            return  gs.getChunkAt(chunkPos.x,chunkPos.z).getSubchunk(chunkPos.y);
        } 
        catch(error)
        {
            console.log(error);
        }
    }
    public static placeBlock(pos:Vector4,id:number,gs:GameScene)
    {
        const llight =  World.getBlock(pos,gs).lightFBlock;
        const slight =  World.getBlock(pos,gs).skyLight;
        World.setBlockNoLight(pos,id,gs);
        Lighter.removeLight(pos.x,pos.y,pos.z,llight,gs);
        SkyLighter.removeLight(pos.x,pos.y,pos.z,slight,gs);
    }
    public static breakBlock(pos:Vector4,gs:GameScene)
    {
        let isGlowing=false;
        if(Block.info[World.getBlock(pos,gs).id].glowing)
            isGlowing=true;
        World.setBlockNoLight(pos,0,gs);
        if(isGlowing)
            Lighter.removeLight(pos.x,pos.y,pos.z,15,gs);
        else
            Lighter.processOneBlockLight(pos.x,pos.y,pos.z,gs);
        SkyLighter.processOneBlockLight(pos.x,pos.y,pos.z,gs);
    }
    public static getBlock(blockPos:Vector3,gs:GameScene):Block
    {
        const rounded= blockPos.round();// new Vector3(Math.round(blockPos.x)%16,Math.round(blockPos.y),Math.round(blockPos.z)%16);
        let inChunkPos = rounded.copy();
        inChunkPos.x = inChunkPos.x%16;
        inChunkPos.z = inChunkPos.z%16;
        if(inChunkPos.x<0)
            inChunkPos.x = 16-Math.abs(inChunkPos.x);
        if(inChunkPos.z<0)
            inChunkPos.z = 16-Math.abs(inChunkPos.z);
     
        if(inChunkPos.x<0|| inChunkPos.z<0)
        {
            inChunkPos=  inChunkPos.abs();
      
        }
 

        const chunkPosX =Math.floor(rounded.x/16);
        const chunkPosZ=Math.floor(rounded.z/16);
        try
        {
            return gs.getChunkAt(chunkPosX,chunkPosZ).getBlock(inChunkPos);
        }catch(error)
        {
            return undefined;
        }
    }
    
    static  getBlockAndSub(blockPos:Vector3,gs:GameScene):{block:Block,sub:SubChunk}
    {
        const rounded= blockPos.round();
        let inChunkPos = rounded.copy();
        inChunkPos.x = inChunkPos.x%16;
        inChunkPos.z = inChunkPos.z%16;
        if(inChunkPos.x<0)
            inChunkPos.x = 16-Math.abs(inChunkPos.x);
        if(inChunkPos.z<0)
            inChunkPos.z = 16-Math.abs(inChunkPos.z);
     
        if(inChunkPos.x<0|| inChunkPos.z<0)
        {
            inChunkPos=  inChunkPos.abs();
      
        }
        const chunkPosX =Math.floor(rounded.x/16);
        const chunkPosZ=Math.floor(rounded.z/16);
        try
        {
          
            return gs.getChunkAt(chunkPosX,chunkPosZ).getBlockSub(inChunkPos);
        }catch(error)
        {
            console.log(inChunkPos);
            // console.log(Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos));
            console.error(error);
        }
    }
}