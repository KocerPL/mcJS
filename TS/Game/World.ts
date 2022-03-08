import { Vector } from "../Engine/Utils/Vector.js";
import { Main } from "../Main.js";
import { Block } from "./Block.js";
import { Chunk } from "./Chunk.js";
declare var perlin: any;
export class World
{
    private Chunks:Array<Array<Chunk>> = new Array();
    public static heightMap:Array<Array<number>> = new Array(256);
public static waterLevel:number = 24;
    public static init()
    {
        this.genHeightMap();
        console.log(perlin);
    }
   public static generateTree(vec:Vector)
    {
        console.log("shedule Generating tree")
        Main.tasks[3].push(()=>{
            let i;
        for( i=vec.y;i<vec.y+5;i++)
        {
            //console.log("Generating tree")
            this.setBlock(new Vector(vec.x,i,vec.z),6);

        }
        
        for(let x=vec.x-2;x<=vec.x+2;x++)
        for(let z=vec.z-2;z<=vec.z+2;z++)
        {
            this.setBlock(new Vector(x,i,z),9); 
        }
        this.setBlock(new Vector(vec.x,i,vec.z),6);
        i++;
        for(let x=vec.x-2;x<=vec.x+2;x++)
        for(let z=vec.z-2;z<=vec.z+2;z++)
        {
            
            this.setBlock(new Vector(x,i,z),9); 
        }
        this.setBlock(new Vector(vec.x+2,i,vec.z+2),0); 
        this.setBlock(new Vector(vec.x+2,i,vec.z-2),0); 
        this.setBlock(new Vector(vec.x-2,i,vec.z+2),0);
        this.setBlock(new Vector(vec.x-2,i,vec.z-2),0);
        i++;
        this.setBlock(new Vector(vec.x+1,i,vec.z),9); 
        this.setBlock(new Vector(vec.x-1,i,vec.z),9); 
        this.setBlock(new Vector(vec.x,i,vec.z+1),9);
        this.setBlock(new Vector(vec.x,i,vec.z-1),9);
        this.setBlock(new Vector(vec.x,i,vec.z),6);
        i++;
        this.setBlock(new Vector(vec.x+1,i,vec.z),9); 
        this.setBlock(new Vector(vec.x-1,i,vec.z),9); 
        this.setBlock(new Vector(vec.x,i,vec.z+1),9);
        this.setBlock(new Vector(vec.x,i,vec.z-1),9);
        this.setBlock(new Vector(vec.x,i,vec.z),9);
        });
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
                /*try {
                    if(z!=0) if(inChunkPos.x<0)
        inChunkPos.x = inChunkPos.x+16;
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
                    
                }*/
                this.heightMap[x][z] =Math.round((perlin.get(x/128,z/128)+1)*30);
            }
        }
    }
    public static setLight(blockPos:Vector,lightLevel:number)
    {
        try
        {
    
       let inChunkPos = new Vector(Math.round(blockPos.x)%16,Math.round(blockPos.y),Math.round(blockPos.z)%16);
       if(inChunkPos.x<0)
       inChunkPos.x = 16-Math.abs(inChunkPos.x);
       if(inChunkPos.z<0)
       inChunkPos.z = 16-Math.abs(inChunkPos.z);
        let chunkPos =new Vector(Math.floor(Math.round(blockPos.x)/16),Math.round(blockPos.y),Math.floor(Math.round(blockPos.z)/16));
        Main.chunks[chunkPos.x][chunkPos.z].setLight(inChunkPos,lightLevel);
        let sc = Main.chunks[chunkPos.x][chunkPos.z].getSubchunk(blockPos.y)
        if(!sc.lightUpdate )
        {
           sc.lightUpdate =true;
          // console.log("okokokok");
          if(sc.generated)
         sc.updateVerticesIndices(9, Main.chunks[chunkPos.x][chunkPos.z].heightmap);
        }
        return Main.chunks[chunkPos.x][chunkPos.z];
        }
        catch(error)
        {
            console.log(error);
        }
    }
   public static setBlock(blockPos:Vector,type:number)
    {
       let inChunkPos = new Vector(Math.round(Math.round(blockPos.x)%16),Math.round(blockPos.y),Math.round(Math.round(blockPos.z)%16));
       if(inChunkPos.x<0)
       inChunkPos.x = 16-Math.abs(inChunkPos.x);
       if(inChunkPos.z<0)
       inChunkPos.z = 16-Math.abs(inChunkPos.z);

        let chunkPos =new Vector(Math.floor(Math.round(blockPos.x)/16),Math.round(blockPos.y),Math.floor(Math.round(blockPos.z)/16));
        
      
        
        try
        {
            Main.chunks[chunkPos.x][chunkPos.z].setBlock(inChunkPos,type);
            if(type<1)
            {
         if(inChunkPos.y>=Main.chunks[chunkPos.x][chunkPos.z].heightmap[inChunkPos.x][inChunkPos.z] )
         {
            //console.log("if");
             let lightLevel = 15;
             let yPos =blockPos.y;
             
             while(this.getBlock(new Vector(blockPos.x,yPos,blockPos.z)).id==0 && lightLevel>0)
             {
               
               //  console.log("while");
                lightLevel--;
                this.setLight(new Vector(blockPos.x,yPos-1,blockPos.z),lightLevel);
                this.setLight(new Vector(blockPos.x+1,yPos,blockPos.z),lightLevel);
                this.setLight(new Vector(blockPos.x-1,yPos,blockPos.z),lightLevel);
                this.setLight(new Vector(blockPos.x,yPos,blockPos.z+1),lightLevel);
                this.setLight(new Vector(blockPos.x,yPos,blockPos.z-1),lightLevel);
                yPos--;

             }
             Main.chunks[chunkPos.x][chunkPos.z].heightmap[inChunkPos.x][inChunkPos.z] =yPos-1;
             if(  Main.chunks[chunkPos.x][chunkPos.z].getSubchunk(blockPos.y).generated)
             Main.chunks[chunkPos.x][chunkPos.z].updateSubchunkAt(blockPos.y);
             if(  Main.chunks[chunkPos.x][chunkPos.z].getSubchunk(blockPos.y).generated)
             Main.chunks[chunkPos.x][chunkPos.z].updateSubchunkAt(yPos);
         }
         else
         {
            let lightLevel = Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos).lightLevel-1;
            if(lightLevel>1)
            {
            this.lightFunc(new Vector(blockPos.x,blockPos.y-1,blockPos.z),lightLevel);
            this.lightFunc(new Vector(blockPos.x,blockPos.y+1,blockPos.z),lightLevel);
                this.lightFunc(new Vector(blockPos.x+1,blockPos.y,blockPos.z),lightLevel);
                this.lightFunc(new Vector(blockPos.x-1,blockPos.y,blockPos.z),lightLevel);
                this.lightFunc(new Vector(blockPos.x,blockPos.y,blockPos.z+1),lightLevel);
                this.lightFunc(new Vector(blockPos.x,blockPos.y,blockPos.z-1),lightLevel);
            }
            }
        }
            else
            {
              //  console.log("ok");
                let lightLevel =   15;
                this.lightFunc(blockPos,lightLevel);
                this.lightFunc(new Vector(blockPos.x,blockPos.y-1,blockPos.z),lightLevel);
                this.lightFunc(new Vector(blockPos.x,blockPos.y+1,blockPos.z),lightLevel);
                    this.lightFunc(new Vector(blockPos.x+1,blockPos.y,blockPos.z),lightLevel);
                    this.lightFunc(new Vector(blockPos.x-1,blockPos.y,blockPos.z),lightLevel);
                    this.lightFunc(new Vector(blockPos.x,blockPos.y,blockPos.z+1),lightLevel);
                    this.lightFunc(new Vector(blockPos.x,blockPos.y,blockPos.z-1),lightLevel);
            }
         

        }
        catch(error)
        {
          return;
        }
    }
    private static lightFunc(vec,lightLevel)
    {
        if(this.getBlock(vec).lightLevel <lightLevel)
        this.setLight(vec,lightLevel);
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
 

        let chunkPos =new Vector(Math.floor(Math.round(blockPos.x)/16),Math.round(blockPos.y),Math.floor(Math.round(blockPos.z)/16));
       try
       {
          
        return Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos);
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
            //return 1;
        return Math.round((perlin.get(x/128,z/128)+1)*30);
        }
        catch(error)
        {}
        return 0;
    }
}