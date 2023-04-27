import { SubChunk } from "./WorldBuilder/SubChunk.js";
import { Chunk } from "./WorldBuilder/Chunk.js";
import { Vector } from "../Engine/Utils/Vector.js";


const settings = {
    maxChunks:120
};
class Main
{
    chunkMap:Map<string,Chunk> = new Map();
    run():void
    {
 
        this.updateChunks();
    }
    onBlock(pos:Vector,id:number)
    {
        const chPos:Vector =pos.modulo(16);
        this.getChunk(chPos).subchunks[chPos.y].blocks;
    }
    sendSubChunk(subchunk:SubChunk)
    {
        postMessage({type:"subchunk",blocks:subchunk.blocks,subX:subchunk.pos.x,subZ:subchunk.pos.z,subY:subchunk.pos.y});
    }
    sendChunkReady(pos:Vector)
    {
        postMessage({type:"chunkReady",chunkX:pos.x,chunkZ:pos.z});
    }
    getChunk(pos:Vector)
    {
        return this.chunkMap.get(pos.x+","+pos.z);
    }
    updateChunks()
    {
        postMessage({type:"console",msg:"Starting server in separated thread!!"});
        let step=1;
        let iter =1;
        let k=0;
        const nextCoords= new Vector(0,0,0);
        const chunk =new Chunk(new Vector(nextCoords.x,0,nextCoords.z));
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
                const chunk =new Chunk(new Vector(nextCoords.x,0,nextCoords.z));
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
                const chunk =new Chunk(new Vector(nextCoords.x,0,nextCoords.z));
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
const main = new Main();
addEventListener("message", e => {
  
    if(e.data=="start")
    {
   
        main.run();
    }
});