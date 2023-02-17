import { Vector } from "../../Engine/Utils/Vector.js";
import { SubChunk } from "./SubChunk.js";

export class Chunk
{
  pos:Vector = new Vector(0,0,0);
  subchunks:Array<SubChunk> = new Array(16);
  constructor(pos:Vector)
  {
    this.pos = pos;
  }
  generate()
  {
    for(let i=0;i<this.subchunks.length;i++)
    {
        this.subchunks[i] = new SubChunk(new Vector(this.pos.x,i,this.pos.z));
        for(let y=0;y<16;y++) for(let x=0;x<16;x++)for(let z=0;z<16;z++) 
        {
            let index =x+(y*16)+(z*64)
            if(y+(i*16)<130)
            this.subchunks[i].blocks[index] = 1;
             else
             this.subchunks[i].blocks[index] = 0;
        this.subchunks[i].lightMap[index] = 0;
        }
    }
  }
}