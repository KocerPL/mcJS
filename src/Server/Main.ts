import { SubChunk } from "./WorldBuilder/SubChunk.js";
import { Chunk } from "./WorldBuilder/Chunk.js";
import { Vector } from "../Engine/Utils/Vector.js";


var settings = {
  maxChunks:120
}
class Main
{
  chunkMap:Map<String,Chunk> = new Map();
  run():void
  {
  this.updateChunks();
  }
 sendSubChunk(subchunk:SubChunk)
  {
    postMessage({type:"subchunk",blocks:subchunk.blocks,subX:subchunk.pos.x,subZ:subchunk.pos.z,subY:subchunk.pos.y});
  }
 sendChunkReady(pos:Vector)
  {
    postMessage({type:"chunkReady",chunkX:pos.x,chunkZ:pos.z});
  }
  
 updateChunks()
  {
    let step=1;
    let iter =1;
    let k=0;
    let nextCoords= new Vector(0,0,0);
    let chunk =new Chunk(new Vector(nextCoords.x,0,nextCoords.z));
    chunk.generate();
    for(let i=0;i<16;i++)
    this.sendSubChunk(chunk.subchunks[i]);
    this.sendChunkReady(new Vector(nextCoords.x,0,nextCoords.z));
    postMessage({type:"console",msg:"Chunks ready!!"});
    while(k<settings.maxChunks)
    {
      for(let i=0;i<iter;i++)
      {
        nextCoords.x+=step;
        let chunk =new Chunk(new Vector(nextCoords.x,0,nextCoords.z));
        chunk.generate();
        this.chunkMap.set(nextCoords.x+","+nextCoords.z,chunk);
        for(let i=0;i<16;i++)
        this.sendSubChunk(chunk.subchunks[i]);
        this.sendChunkReady(new Vector(nextCoords.x,0,nextCoords.z));
        postMessage({type:"console",msg:"Chunks ready!!"});
        k++;
      }
      for(let i=0;i<iter;i++)
      {
        nextCoords.z+=step;
        let chunk =new Chunk(new Vector(nextCoords.x,0,nextCoords.z));
        chunk.generate();
        this.chunkMap.set(nextCoords.x+","+nextCoords.z,chunk);
        for(let i=0;i<16;i++)
        this.sendSubChunk(chunk.subchunks[i]);
        this.sendChunkReady(new Vector(nextCoords.x,0,nextCoords.z));
        postMessage({type:"console",msg:"Chunks ready!!"});
        k++;
      }
      iter++;
      step= -step;
  }
  }
}
let main = new Main();
addEventListener('message', e => {
  
    if(e.data=="start")
   {
    postMessage({type:"console",msg:"Starting server in separated thread!!"});
    main.run();
   }
});