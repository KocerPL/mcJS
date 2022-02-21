import { Chunk } from "./Chunk.js";
export class World
{
    private Chunks:Array<Array<Chunk>> = new Array();
    private tasks:Array<Function>;
    update(startTime:number)
    {
        let   actualTime =Date.now();
        while(this.tasks.length> 0 && actualTime-5 < startTime)
        {
          actualTime =Date.now();
          console.log(actualTime);
         let work = this.tasks.shift();
         work();
        }
    }
    public getBlock()
    {

    }
}