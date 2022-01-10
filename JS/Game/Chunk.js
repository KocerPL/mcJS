import { Vector } from "../Engine/Utils/Vector.js";
import { Block } from "./Block.js";

export class Chunk 
{
    /*
    TODO:
    "The bulk of Minecraft's chunk rendering goes through a vertex array. The world is split into 16x16x16-block render-chunks
     (which currently happen to be the same as storage-chunks, but it wasn't always that way).

Each render-chunk is converted to a vertex array, and rendered. It uses OpenGL display lists (one per render-chunk) as an older alternative to VBOs.
 If any blocks in a render-chunk change, the entire vertex array and display list for that chunk are regenerated."
    */
    static HEIGHT = 16;
    static WIDTH = 16;
    static LENGTH = 16;
    constructor(gl,x,y)
    {
        this.x= x;
        this.y=y;
        this.blocks = new Array()
        for(var i=0;i<Chunk.WIDTH;i++)//x
        {
            this.blocks[i]= new Array();
            for(var j=0;j<Chunk.HEIGHT;j++)//y
            {
                this.blocks[i][j]= new Array();
                for(var k=0;k<Chunk.LENGTH;k++)//z
                {
                    this.blocks[i][j][k] = Block.type.DIRT;
                }
            }
        }
    }
    render(projection,view)
    {
        Block.prepareRenderer();
        this.forAll((block,x,y,z)=>{
            //console.log(block)
           Block.render(new Vector(x,y,z),block,projection,view);
        })
    }
    forAll(func)
    {
        for(var i=0;i<Chunk.WIDTH;i++)//x
        {
            for(var j=0;j<Chunk.HEIGHT;j++)//y
            {
                for(var k=0;k<Chunk.LENGTH;k++)//z
                { 
                    func(this.blocks[i][j][k],i,j,k);
                }
            }
        }
    }
}