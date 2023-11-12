import { Chunk } from "./Chunk";
import fs = require("fs");
import { Generator } from "./Generator";
import { Entity } from "../Entities/Entity";
import { EntityManager } from "../managers/EntityManager";
import { Main } from "../Main";
import { Item } from "../Entities/Item";
// class all about loading world, and changing , and generation
export class ChunkInfo
{
    constructor(chunk:Chunk)
    {
        this.subchunks = chunk.subchunks;
        this.pos = chunk.pos;
    }
    subchunks:Array<Array<number>>;
    pos:Array<number>;
    entities:Array<any>= new Array();
}
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
    if(fs.existsSync(this.dir+"/"+x+"."+z+".kChunk"))
    {
    let   chunk = new Chunk();
    let chunkInfo:ChunkInfo= JSON.parse(fs.readFileSync(this.dir+"/"+x+"."+z+".kChunk").toString());
    chunk.pos=chunkInfo.pos;
    chunk.subchunks = chunkInfo.subchunks;
    for(let entInfo of chunkInfo.entities)
    if(entInfo.type == "item")
    Main.entityManager.add(new Item(entInfo.pos, entInfo.id,entInfo.uuid));
    this.loadedChunks.set(x+"-"+z,chunk);
    return chunk;
    }
    let chunk = this.generator.generate(x,z);
    this.loadedChunks.set(x+"-"+z,chunk);
    return chunk;
    }
    saveChunk(chunk:Chunk)
{
let chunkInfo = new ChunkInfo(chunk);
chunkInfo.entities = Main.entityManager.getByAABB(chunkInfo.pos[0]*16,0,chunkInfo.pos[1]*16,
    (chunkInfo.pos[0]+1)*16,256,(chunkInfo.pos[1]+1)*16);
    fs.writeFileSync(this.dir+"/"+chunk.pos[0]+"."+chunk.pos[1]+".kChunk",JSON.stringify(chunkInfo));
}
    saveAll()
    {
        console.log("Saving chunks...");
        for(let chunk of this.loadedChunks)
        this.saveChunk(chunk[1]);
    }
    getSubchunk()
    {

    }
 public static  toSubIndex(x:number,y:number,z:number)
{
    return x+(y*16)+(z*256);
}
}