import { Vector } from "../Engine/Utils/Vector.js";
import { Main } from "../Main.js";
import { directions } from "./Block.js";
export class World {
    Chunks = new Array();
    static heightMap = new Array(256);
    static waterLevel = 25;
    static init() {
        this.genHeightMap();
        console.log(perlin);
    }
    static generateTree(vec) {
        console.log("shedule Generating tree");
        Main.tasks[3].push(() => {
            let i;
            for (i = vec.y + 1; i < vec.y + 5; i++) {
                //console.log("Generating tree")
                this.setBlockNoLight(new Vector(vec.x, i, vec.z), 6);
            }
            for (let x = vec.x - 2; x <= vec.x + 2; x++)
                for (let z = vec.z - 2; z <= vec.z + 2; z++) {
                    this.setBlockNoLight(new Vector(x, i, z), 9);
                }
            this.setBlockNoLight(new Vector(vec.x, i, vec.z), 6);
            i++;
            for (let x = vec.x - 2; x <= vec.x + 2; x++)
                for (let z = vec.z - 2; z <= vec.z + 2; z++) {
                    this.setBlockNoLight(new Vector(x, i, z), 9);
                }
            this.setBlockNoLight(new Vector(vec.x, i, vec.z), 6);
            this.setBlockNoLight(new Vector(vec.x + 2, i, vec.z + 2), 0);
            this.setBlockNoLight(new Vector(vec.x + 2, i, vec.z - 2), 0);
            this.setBlockNoLight(new Vector(vec.x - 2, i, vec.z + 2), 0);
            this.setBlockNoLight(new Vector(vec.x - 2, i, vec.z - 2), 0);
            i++;
            this.setBlockNoLight(new Vector(vec.x + 1, i, vec.z), 9);
            this.setBlockNoLight(new Vector(vec.x - 1, i, vec.z), 9);
            this.setBlockNoLight(new Vector(vec.x, i, vec.z + 1), 9);
            this.setBlockNoLight(new Vector(vec.x, i, vec.z - 1), 9);
            this.setBlockNoLight(new Vector(vec.x, i, vec.z), 6);
            i++;
            this.setBlockNoLight(new Vector(vec.x + 1, i, vec.z), 9);
            this.setBlockNoLight(new Vector(vec.x - 1, i, vec.z), 9);
            this.setBlockNoLight(new Vector(vec.x, i, vec.z + 1), 9);
            this.setBlockNoLight(new Vector(vec.x, i, vec.z - 1), 9);
            this.setBlockNoLight(new Vector(vec.x, i, vec.z), 9);
        });
    }
    static genHeightMap() {
        let height = 20;
        let height2 = 20;
        for (let x = 0; x < 256; x++) {
            if (x % 4)
                height += Math.round(Math.random() * 2) - 1;
            this.heightMap[x] = new Array();
            for (let z = 0; z < 256; z++) {
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
                this.heightMap[x][z] = Math.round((perlin.get(x / 128, z / 128) + 1) * 30);
            }
        }
    }
    /*   public static setLight(blockPos:Vector,lightLevel:number)
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
            sc.update(9);
           }
           return Main.chunks[chunkPos.x][chunkPos.z];
           }
           catch(error)
           {
               console.log(error);
           }
       }*/
    static setBlockNoLight(blockPos, type) {
        let inChunkPos = new Vector(Math.round(Math.round(blockPos.x) % 16), Math.round(blockPos.y), Math.round(Math.round(blockPos.z) % 16));
        if (inChunkPos.x < 0)
            inChunkPos.x = 16 - Math.abs(inChunkPos.x);
        if (inChunkPos.z < 0)
            inChunkPos.z = 16 - Math.abs(inChunkPos.z);
        let chunkPos = new Vector(Math.floor(Math.round(blockPos.x) / 16), Math.round(blockPos.y), Math.floor(Math.round(blockPos.z) / 16));
        try {
            let chunk = Main.getChunkAt(chunkPos.x, chunkPos.z);
            if (inChunkPos.y >= chunk.heightmap[inChunkPos.x][inChunkPos.z]) {
                //  console.log("heightmap");
                let i = 0;
                if (type <= 0) {
                    i = 1;
                    while (chunk.getBlock(new Vector(inChunkPos.x, inChunkPos.y - i, inChunkPos.z)).id <= 0) {
                        i++;
                    }
                }
                chunk.heightmap[inChunkPos.x][inChunkPos.z] = inChunkPos.y - i;
            }
            chunk.setBlock(inChunkPos, type);
        }
        catch (error) {
            //  console.error(error);
            return;
        }
    }
    static getSubchunk(blockPos) {
        let chunkPos = new Vector(Math.floor(Math.round(blockPos.x) / 16), Math.round(blockPos.y), Math.floor(Math.round(blockPos.z) / 16));
        try {
            return Main.getChunkAt(chunkPos.x, chunkPos.z).getSubchunk(chunkPos.y);
        }
        catch (error) {
            console.log(error);
        }
    }
    /*  public static setBlock(blockPos:Vector,type:number)
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
       public static setBlock2(blockPos:Vector,type:number)
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
                   if(inChunkPos.y==Main.chunks[chunkPos.x][chunkPos.z].heightmap[inChunkPos.x][inChunkPos.z] )
                   {
                   
                   let i =0;
                   while(  Main.chunks[chunkPos.x][chunkPos.z].getBlock(new Vector(inChunkPos.x,inChunkPos.y-i,inChunkPos.z)).id==0)
                   {
                       i++;
                       Main.chunks[chunkPos.x][chunkPos.z].getBlock(new Vector(inChunkPos.x,inChunkPos.y-i,inChunkPos.z)).lightLevel=15;
                   }
                   Main.chunks[chunkPos.x][chunkPos.z].getBlock(new Vector(inChunkPos.x,inChunkPos.y-i,inChunkPos.z)).lightLevel=15;
                   Main.chunks[chunkPos.x][chunkPos.z].getBlock(new Vector(inChunkPos.x,inChunkPos.y-i+1,inChunkPos.z)).lightDir=directions.SKYLIGHT;
                   Main.chunks[chunkPos.x][chunkPos.z].heightmap[inChunkPos.x][inChunkPos.z] = inChunkPos.y-i;
                   }
                   this.lightGetALG(blockPos);
               }
               else
               {
                   if(inChunkPos.y>Main.chunks[chunkPos.x][chunkPos.z].heightmap[inChunkPos.x][inChunkPos.z] )
                   {
                       let i =1;
                 
                       while(  Main.chunks[chunkPos.x][chunkPos.z].getBlock(new Vector(inChunkPos.x,inChunkPos.y-i,inChunkPos.z)).id==0)
                       {
                           i++;
                           Main.chunks[chunkPos.x][chunkPos.z].getBlock(new Vector(inChunkPos.x,inChunkPos.y-i,inChunkPos.z)).lightLevel=0;
                       }
                       Main.chunks[chunkPos.x][chunkPos.z].getBlock(new Vector(inChunkPos.x,inChunkPos.y-i,inChunkPos.z)).lightLevel=0;
                       Main.chunks[chunkPos.x][chunkPos.z].heightmap[inChunkPos.x][inChunkPos.z] = inChunkPos.y;
                   }
                   this.lightPropagation(blockPos,Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos).lightLevel-1,directions.UNDEF,new Array());
               }
           }
           catch(error)
           {
               console.error(error);
           }
       }*/
    static lightPropagation(vec, lightLevel, direction, blockList) {
        console.log("lightning...", lightLevel);
        if (lightLevel <= 0 || blockList.includes(this.getBlock(vec)) || (direction != directions.UNDEF && direction == this.getBlock(vec).lightDir))
            return;
        this.lightFunc(vec, lightLevel);
        this.getBlock(vec).lightDir = direction;
        blockList.push(this.getBlock(vec));
        if (this.getBlock(vec).id < 1) {
            this.lightPropagation(new Vector(vec.x - 1, vec.y, vec.z), lightLevel - 1, directions.NEG_X, blockList);
            this.lightPropagation(new Vector(vec.x + 1, vec.y, vec.z), lightLevel - 1, directions.POS_X, blockList);
            this.lightPropagation(new Vector(vec.x, vec.y, vec.z - 1), lightLevel - 1, directions.NEG_Z, blockList);
            this.lightPropagation(new Vector(vec.x, vec.y, vec.z + 1), lightLevel - 1, directions.POS_Z, blockList);
            this.lightPropagation(new Vector(vec.x, vec.y - 1, vec.z), lightLevel - 1, directions.NEG_Y, blockList);
            this.lightPropagation(new Vector(vec.x, vec.y + 1, vec.z), lightLevel - 1, directions.POS_Y, blockList);
        }
    }
    static lightGetALG(vec) {
        let arr = [{ bl: new Vector(vec.x - 1, vec.y, vec.z), dir: directions.NEG_X, negDir: directions.POS_X },
            { bl: new Vector(vec.x + 1, vec.y, vec.z), dir: directions.POS_X, negDir: directions.NEG_X },
            { bl: new Vector(vec.x, vec.y, vec.z - 1), dir: directions.NEG_Z, negDir: directions.POS_Z },
            { bl: new Vector(vec.x, vec.y, vec.z + 1), dir: directions.POS_Z, negDir: directions.NEG_Z },
            { bl: new Vector(vec.x, vec.y - 1, vec.z), dir: directions.NEG_Y, negDir: directions.POS_Y },
            { bl: new Vector(vec.x, vec.y + 1, vec.z), dir: directions.POS_Y, negDir: directions.NEG_Y },
        ];
        let max;
        let ind = 0;
        for (let i = 0; i < arr.length; i++) {
            if (this.getBlock(arr[i].bl).lightDir != arr[i].negDir && (max == undefined || this.getBlock(arr[i].bl).lightLevel > this.getBlock(max.bl).lightLevel)) {
                ind = i;
                max = { ...arr[i] };
            }
        }
        console.log(max);
        if (max != undefined && this.getBlock(max.bl).lightLevel - 1) {
            this.getBlock(vec).lightDir = max.dir;
            //   this.setLight( vec,this.getBlock(max.bl).lightLevel-1);
            for (let i = 0; i < arr.length; i++) {
                if (this.getBlock(arr[i].bl).lightDir == arr[i].negDir) {
                    this.lightGetALG(arr[i].bl);
                }
            }
        }
    }
    static lightFunc(vec, lightLevel) {
        //  if(this.getBlock(vec).lightLevel <lightLevel)
        //  this.setLight(vec,lightLevel);
    }
    static getBlock(blockPos) {
        let inChunkPos = new Vector(Math.round(blockPos.x) % 16, Math.round(blockPos.y), Math.round(blockPos.z) % 16);
        if (inChunkPos.x < 0)
            inChunkPos.x = 16 - Math.abs(inChunkPos.x);
        if (inChunkPos.z < 0)
            inChunkPos.z = 16 - Math.abs(inChunkPos.z);
        if (inChunkPos.x < 0 || inChunkPos.z < 0) {
            inChunkPos = inChunkPos.abs();
        }
        let chunkPos = new Vector(Math.floor(Math.round(blockPos.x) / 16), Math.round(blockPos.y), Math.floor(Math.round(blockPos.z) / 16));
        try {
            return Main.getChunkAt(chunkPos.x, chunkPos.z).getBlock(inChunkPos);
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
            //return 1;
            return Math.round((perlin.get(x / 128, z / 128) + 1) * 30);
        }
        catch (error) { }
        return 0;
    }
}
