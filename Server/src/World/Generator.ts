import { toIndex } from "../Main";
import { Chunk } from "./Chunk";

export class Generator
{
    WorldSeed = 6969696969696969;
    generate(x,z):Chunk
    {
        let chunk= new Chunk();
        chunk.pos = new Array(2);
        chunk.pos[0] =x;
        chunk.pos[1] =z;
        chunk.subchunks = new Array(16);
        for(let i=0;i<16;i++)
        {
            let sub = new Array(4096);
            for(let x=0;x<16;x++)
            for(let y=0;y<16;y++)
            for(let z=0;z<16;z++)
                if(y+(i*16)==64)
                sub[toIndex(x,y,z)]=1;
                else if(y+(i*16)<64)
                sub[toIndex(x,y,z)]=1;
                else
                sub[toIndex(x,y,z)]=0;
            chunk.subchunks[i] = sub;
        }
        return  chunk;
    }
}