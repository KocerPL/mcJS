import { Chunk } from "./Chunk.js";
export class World
{
    private Chunks:Array<Array<Chunk>> = new Array();
    public static heightMap:Array<Array<number>> = new Array(256);

    public static init()
    {
        this.genHeightMap();
    }
    public static genHeightMap()
    {
        
      
        for(let x=0; x<256;x++)
        {

            this.heightMap[x] = new Array();
            for(let z=0;z<256;z++)
            {
             
                this.heightMap[x][z] = 10;
            }
        }
    }
    public static getHeight(x,z)
    {
        try
        {
        return this.heightMap[x][z];
        }
        catch(error)
        {}
        return 0;
    }
    public getBlock()
    {

    }
}