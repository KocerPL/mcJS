import { Vector } from "../Engine/Utils/Vector.js";
import { Main } from "../Main.js";
import { Chunk } from "./Chunk.js";
export class World
{
    private Chunks:Array<Array<Chunk>> = new Array();
    public static heightMap:Array<Array<number>> = new Array(256);

    public static init()
    {
        this.genHeightMap();
    }
    public static genHeightMap()
    {
        let height = 20;
        let height2 =20;
        for(let x=0; x<256;x++)
        {
            if(x%4)
            height+= Math.round(Math.random()*2)-1;
            this.heightMap[x] = new Array();
            for(let z=0;z<256;z++)
            {
                try {
                    if(z!=0)
                    {
                   height2 = Math.round((Math.random()*2)-1) +  this.heightMap[x][z-1];
                   while(height2>this.heightMap[x-1][z]+1 )
                   {
                       height2 -=1;
                   }
                   while( height2<this.heightMap[x-1][z]-1)
                   {
                    height2 +=1;
                   }
                    }
                   else
                   height2 =height;
                } catch (error) {
                    
                }
                this.heightMap[x][z] =height2;
            }
        }
    }
   public static setBlock(blockPos:Vector,type:number)
    {
       let inChunkPos = new Vector(Math.round(Math.round(blockPos.x)%16),Math.round(blockPos.y),Math.round(Math.round(blockPos.z)%16));
        let chunkPos =new Vector(Math.floor(Math.round(blockPos.x)/16),Math.round(blockPos.y),Math.floor(Math.round(blockPos.z)/16));
        try
       {
        Main.chunks[chunkPos.x][chunkPos.z].setBlock(inChunkPos,type);
       }catch(error)
       {

       }
       return;
    }
    public static getBlock(blockPos:Vector)
    {
        let inChunkPos = new Vector(Math.round(Math.round(blockPos.x)%16),Math.round(blockPos.y),Math.round(Math.round(blockPos.z)%16));
        let chunkPos =new Vector(Math.floor(Math.round(blockPos.x)/16),Math.round(blockPos.y),Math.floor(Math.round(blockPos.z)/16));
       try
       {
        return Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos);
       }catch(error)
       {}
       return 0;
    }
    public static getHeight(x,z)
    {
        try
        {
        return this.heightMap[x][z];
        }
        catch(error)
        {}
        return 0;
    }
    public getBlock()
    {

    }
}