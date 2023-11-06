import { Chunk } from "./Chunk";
import fs = require("fs");
import { Generator } from "./Generator";
// class all about loading world, and changing , and generation
export class World
{
    dir:string;
    generator:Generator;
    loadedChunks:Map<string,Chunk>= new Map();
    constructor(dir:string)
    {
        this.dir = dir;
        this.generator = new Generator();
    }
   public getChunk(x:number,z:number):Chunk
    {
        if(this.loadedChunks.has(x+"-"+z))
      return this.loadedChunks.get(x+"-"+z)
    if(fs.existsSync(this.dir+"/world/"+x+"."+z+".kChunk"))
    {
    let   chunk = new Chunk();
    chunk= JSON.parse(fs.readFileSync(this.dir+"/world/"+x+"."+z+".kChunk").toString());
    //chunk.pos=[x,z];
    this.loadedChunks.set(x+"-"+z,chunk);
    return chunk;
    }
    let chunk = this.generator.generate(x,z);
    this.loadedChunks.set(x+"-"+z,chunk);
    return chunk;
    }
    saveChunk(chunk:Chunk)
{
    fs.writeFileSync(this.dir+"/world/"+chunk.pos[0]+"."+chunk.pos[1]+".kChunk",JSON.stringify(chunk));
}
    getSubchunk()
    {

    }
 public static  toSubIndex(x:number,y:number,z:number)
{
    return x+(y*16)+(z*256);
}
}