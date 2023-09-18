import { Vector } from "../Engine/Utils/Vector.js";
import { Lighter } from "../Lighter.js";
import { Main } from "../Main.js";
import {    PerlinN } from "../PerlinNoise.js";
import { SkyLighter } from "../SkyLighter.js";
import { Block, blocks, directions } from "./Block.js";
import { Chunk } from "./Chunk.js";
import { SubChunk } from "./SubChunk.js";
const perlin = new PerlinN();
export class World
{
    private Chunks:Array<Array<Chunk>> = [];
    public static waterLevel = 0;
    public static height=50;
    public static erosion=new PerlinN();
    public static init()
    {
        console.log(perlin);
    }
    public static generateTree(vec:Vector)
    {
        console.log("shedule Generating tree");
        let i=vec.y+5;
       
        
        for(let x=vec.x-2;x<=vec.x+2;x++)
            for(let z=vec.z-2;z<=vec.z+2;z++)
            {
                this.setBlockNoLight(new Vector(x,i,z),9); 
            }
        this.setBlockNoLight(new Vector(vec.x,i,vec.z),6);
        i++;
        for(let x=vec.x-2;x<=vec.x+2;x++)
            for(let z=vec.z-2;z<=vec.z+2;z++)
            {
            
                this.setBlockNoLight(new Vector(x,i,z),9); 
            }
        this.setBlockNoLight(new Vector(vec.x,i,vec.z),6);
        this.setBlockNoLight(new Vector(vec.x+2,i,vec.z+2),0); 
        this.setBlockNoLight(new Vector(vec.x+2,i,vec.z-2),0); 
        this.setBlockNoLight(new Vector(vec.x-2,i,vec.z+2),0);
        this.setBlockNoLight(new Vector(vec.x-2,i,vec.z-2),0);
        i++;
        this.setBlockNoLight(new Vector(vec.x+1,i,vec.z),9); 
        this.setBlockNoLight(new Vector(vec.x-1,i,vec.z),9); 
        this.setBlockNoLight(new Vector(vec.x,i,vec.z+1),9);
        this.setBlockNoLight(new Vector(vec.x,i,vec.z-1),9);
        this.setBlockNoLight(new Vector(vec.x,i,vec.z),6);
        i++;
        this.setBlockNoLight(new Vector(vec.x+1,i,vec.z),9); 
        this.setBlockNoLight(new Vector(vec.x-1,i,vec.z),9); 
        this.setBlockNoLight(new Vector(vec.x,i,vec.z+1),9);
        this.setBlockNoLight(new Vector(vec.x,i,vec.z-1),9);
        this.setBlockNoLight(new Vector(vec.x,i,vec.z),9);
        for( i=vec.y+1;i<vec.y+5;i++)
        {
            //console.log("Generating tree")
            this.setBlockNoLight(new Vector(vec.x,i,vec.z),6);

        }
    }
    public static setBlockNoLight(blockPos:Vector,type:number)
    {
        const inChunkPos:Vector = new Vector(Math.round(Math.round(blockPos.x)%16),Math.round(blockPos.y),Math.round(Math.round(blockPos.z)%16));
        if(inChunkPos.x<0)
            inChunkPos.x = 16-Math.abs(inChunkPos.x);
        if(inChunkPos.z<0)
            inChunkPos.z = 16-Math.abs(inChunkPos.z);

        const chunkPos =new Vector(Math.floor(Math.round(blockPos.x)/16),Math.round(blockPos.y),Math.floor(Math.round(blockPos.z)/16));
        try
        {
            const chunk = Main.getChunkAt(chunkPos.x,chunkPos.z);
            chunk.setBlock(inChunkPos,type);
        }
        catch(error)
        {
          
            //  console.error(error);
            return;
        }
    }
    public static  getHeightMap(blockPos:Vector):number
    {
        const chunkPos =new Vector(Math.floor(Math.round(blockPos.x)/16),Math.round(blockPos.y),Math.floor(Math.round(blockPos.z)/16));
        const inChunkPos = new Vector(Math.round(blockPos.x)%16,Math.round(blockPos.y),Math.round(blockPos.z)%16);
        if(inChunkPos.x<0)
            inChunkPos.x = 16-Math.abs(inChunkPos.x);
        if(inChunkPos.z<0)
            inChunkPos.z = 16-Math.abs(inChunkPos.z);
        try
        {
            return  Main.getChunkAt(chunkPos.x,chunkPos.z).heightmap[inChunkPos.x][inChunkPos.z];
        } 
        catch(error)
        {
            return undefined;
        }
    }
    public static getSubchunk(blockPos:Vector)
    {
        const chunkPos =new Vector(Math.floor(Math.round(blockPos.x)/16),Math.round(blockPos.y),Math.floor(Math.round(blockPos.z)/16));

        try
        {
            return  Main.getChunkAt(chunkPos.x,chunkPos.z).getSubchunk(chunkPos.y);
        } 
        catch(error)
        {
            console.log(error);
        }
    }
    public static placeBlock(pos:Vector,id:number)
    {
        const llight =  World.getBlock(pos).lightFBlock;
        const slight =  World.getBlock(pos).skyLight;
        World.setBlockNoLight(pos,id);
        Lighter.removeLight(pos.x,pos.y,pos.z,llight);
        SkyLighter.removeLight(pos.x,pos.y,pos.z,slight);
    }
    public static breakBlock(pos:Vector)
    {
        let isGlowing=false;
        if(blocks[World.getBlock(pos).id].glowing)
            isGlowing=true;
        World.setBlockNoLight(pos,0);
        if(isGlowing)
            Lighter.removeLight(pos.x,pos.y,pos.z,15);
        else
            Lighter.processOneBlockLight(pos.x,pos.y,pos.z);
        SkyLighter.processOneBlockLight(pos.x,pos.y,pos.z);
    }
    public static getBlock(blockPos:Vector):Block
    {
        let inChunkPos = new Vector(Math.round(blockPos.x)%16,Math.round(blockPos.y),Math.round(blockPos.z)%16);
        if(inChunkPos.x<0)
            inChunkPos.x = 16-Math.abs(inChunkPos.x);
        if(inChunkPos.z<0)
            inChunkPos.z = 16-Math.abs(inChunkPos.z);
     
        if(inChunkPos.x<0|| inChunkPos.z<0)
        {
            inChunkPos=  inChunkPos.abs();
      
        }
 

        const chunkPos =new Vector(Math.floor(Math.round(blockPos.x)/16),Math.round(blockPos.y),Math.floor(Math.round(blockPos.z)/16));
        try
        {
          
            return Main.getChunkAt(chunkPos.x,chunkPos.z).getBlock(inChunkPos);
        }catch(error)
        {
            return undefined;
        }
    }
    
    static  getBlockAndSub(blockPos:Vector):{block:Block,sub:SubChunk}
    {
        let inChunkPos = new Vector(Math.round(blockPos.x)%16,Math.round(blockPos.y),Math.round(blockPos.z)%16);
        if(inChunkPos.x<0)
            inChunkPos.x = 16-Math.abs(inChunkPos.x);
        if(inChunkPos.z<0)
            inChunkPos.z = 16-Math.abs(inChunkPos.z);
     
        if(inChunkPos.x<0|| inChunkPos.z<0)
        {
            inChunkPos=  inChunkPos.abs();
      
        }
 

        const chunkPos =new Vector(Math.floor(Math.round(blockPos.x)/16),Math.round(blockPos.y),Math.floor(Math.round(blockPos.z)/16));
        try
        {
          
            return Main.getChunkAt(chunkPos.x,chunkPos.z).getBlockSub(inChunkPos);
        }catch(error)
        {
            console.log(inChunkPos);
            // console.log(Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos));
            console.error(error);
        }
    }
    public static getHeight(x,z)
    {
        try
        {
            //  if(x<0||z<0)
            //  return this.height;
            //return 1;
            let erosion =50;
            const erN =this.getErosion(x,z);
            if(erN>0.3)
                erosion=50+((erN-0.3)*100);
            return Math.round((perlin.perlin2D(x/256,z/256)+1)*(erosion))+this.height;
        }
        catch(error)
        { /* empty */ }
        return 0;
    }
    public static getErosion(x,z)
    {
        try
        {
            //
            return this.erosion.get(x/256,z/256)+0.2;
        }
        catch(error)
        { /* empty */ }
        return 0;
    }
}