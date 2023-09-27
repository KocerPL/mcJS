import { Vector } from "../Engine/Utils/Vector.js";
import { Lighter } from "../Lighter.js";
import { PerlinN } from "../PerlinNoise.js";
import { SkyLighter } from "../SkyLighter.js";
import { Block } from "./Block.js";
const perlin = new PerlinN();
class World {
    Chunks = [];
    static waterLevel = 0;
    static height = 50;
    static erosion = new PerlinN();
    static init() {
        console.log(perlin);
    }
    /*  public static generateTree(vec:Vector)
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
      }*/
    static setBlockNoLight(blockPos, type, gs) {
        const inChunkPos = new Vector(Math.round(Math.round(blockPos.x) % 16), Math.round(blockPos.y), Math.round(Math.round(blockPos.z) % 16));
        if (inChunkPos.x < 0)
            inChunkPos.x = 16 - Math.abs(inChunkPos.x);
        if (inChunkPos.z < 0)
            inChunkPos.z = 16 - Math.abs(inChunkPos.z);
        const chunkPos = new Vector(Math.floor(Math.round(blockPos.x) / 16), Math.round(blockPos.y), Math.floor(Math.round(blockPos.z) / 16));
        try {
            const chunk = gs.getChunkAt(chunkPos.x, chunkPos.z);
            chunk.setBlock(inChunkPos, type, gs);
        }
        catch (error) {
            //  console.error(error);
            return;
        }
    }
    static getHeightMap(blockPos, gs) {
        const chunkPos = new Vector(Math.floor(Math.round(blockPos.x) / 16), Math.round(blockPos.y), Math.floor(Math.round(blockPos.z) / 16));
        const inChunkPos = new Vector(Math.round(blockPos.x) % 16, Math.round(blockPos.y), Math.round(blockPos.z) % 16);
        if (inChunkPos.x < 0)
            inChunkPos.x = 16 - Math.abs(inChunkPos.x);
        if (inChunkPos.z < 0)
            inChunkPos.z = 16 - Math.abs(inChunkPos.z);
        try {
            return gs.getChunkAt(chunkPos.x, chunkPos.z).heightmap[inChunkPos.x][inChunkPos.z];
        }
        catch (error) {
            return undefined;
        }
    }
    static getSubchunk(blockPos, gs) {
        const chunkPos = new Vector(Math.floor(Math.round(blockPos.x) / 16), Math.round(blockPos.y), Math.floor(Math.round(blockPos.z) / 16));
        try {
            return gs.getChunkAt(chunkPos.x, chunkPos.z).getSubchunk(chunkPos.y);
        }
        catch (error) {
            console.log(error);
        }
    }
    static placeBlock(pos, id, gs) {
        const llight = World.getBlock(pos, gs).lightFBlock;
        const slight = World.getBlock(pos, gs).skyLight;
        World.setBlockNoLight(pos, id, gs);
        Lighter.removeLight(pos.x, pos.y, pos.z, llight, gs);
        SkyLighter.removeLight(pos.x, pos.y, pos.z, slight, gs);
    }
    static breakBlock(pos, gs) {
        let isGlowing = false;
        if (Block.info[World.getBlock(pos, gs).id].glowing)
            isGlowing = true;
        World.setBlockNoLight(pos, 0, gs);
        if (isGlowing)
            Lighter.removeLight(pos.x, pos.y, pos.z, 15, gs);
        else
            Lighter.processOneBlockLight(pos.x, pos.y, pos.z, gs);
        SkyLighter.processOneBlockLight(pos.x, pos.y, pos.z, gs);
    }
    static getBlock(blockPos, gs) {
        let inChunkPos = new Vector(Math.round(blockPos.x) % 16, Math.round(blockPos.y), Math.round(blockPos.z) % 16);
        if (inChunkPos.x < 0)
            inChunkPos.x = 16 - Math.abs(inChunkPos.x);
        if (inChunkPos.z < 0)
            inChunkPos.z = 16 - Math.abs(inChunkPos.z);
        if (inChunkPos.x < 0 || inChunkPos.z < 0) {
            inChunkPos = inChunkPos.abs();
        }
        const chunkPos = new Vector(Math.floor(Math.round(blockPos.x) / 16), Math.round(blockPos.y), Math.floor(Math.round(blockPos.z) / 16));
        try {
            return gs.getChunkAt(chunkPos.x, chunkPos.z).getBlock(inChunkPos);
        }
        catch (error) {
            return undefined;
        }
    }
    static getBlockAndSub(blockPos, gs) {
        let inChunkPos = new Vector(Math.round(blockPos.x) % 16, Math.round(blockPos.y), Math.round(blockPos.z) % 16);
        if (inChunkPos.x < 0)
            inChunkPos.x = 16 - Math.abs(inChunkPos.x);
        if (inChunkPos.z < 0)
            inChunkPos.z = 16 - Math.abs(inChunkPos.z);
        if (inChunkPos.x < 0 || inChunkPos.z < 0) {
            inChunkPos = inChunkPos.abs();
        }
        const chunkPos = new Vector(Math.floor(Math.round(blockPos.x) / 16), Math.round(blockPos.y), Math.floor(Math.round(blockPos.z) / 16));
        try {
            return gs.getChunkAt(chunkPos.x, chunkPos.z).getBlockSub(inChunkPos);
        }
        catch (error) {
            console.log(inChunkPos);
            // console.log(Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos));
            console.error(error);
        }
    }
    static getHeight(x, z) {
        try {
            //  if(x<0||z<0)
            //  return this.height;
            //return 1;
            let erosion = 50;
            const erN = this.getErosion(x, z);
            if (erN > 0.3)
                erosion = 50 + ((erN - 0.3) * 100);
            return Math.round((perlin.perlin2D(x / 256, z / 256) + 1) * (erosion)) + this.height;
        }
        catch (error) { /* empty */ }
        return 0;
    }
    static getErosion(x, z) {
        try {
            //
            return this.erosion.get(x / 256, z / 256) + 0.2;
        }
        catch (error) { /* empty */ }
        return 0;
    }
}
export { World };
