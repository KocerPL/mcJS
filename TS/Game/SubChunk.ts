export class SubChunk
{
    blocks:Array<Array<Array<number>>>= new Array(16);
   static defVertices =[
        //przód
        -0.5,-0.5,-0.5,
        0.5,-0.5,-0.5,
        0.5,0.5,-0.5,
        -0.5,0.5,-0.5,
        //tył
        -0.5,-0.5,0.5,
        0.5,-0.5,0.5,
        0.5,0.5,0.5,
        -0.5,0.5,0.5,
        //lewo
        -0.5,-0.5,-0.5,
        -0.5,-0.5,0.5,
        -0.5,0.5 ,0.5,
        -0.5,0.5,-0.5,
        //prawo
        0.5,-0.5,-0.5,
        0.5,-0.5,0.5,
        0.5,0.5 ,0.5,
        0.5,0.5,-0.5,
        //dół
        -0.5,-0.5,-0.5,
        -0.5,-0.5,0.5,
        0.5,-0.5 ,0.5,
        0.5,-0.5,-0.5,
        //góra
        -0.5,0.5,-0.5,
        -0.5,0.5,0.5,
        0.5,0.5 ,0.5,
        0.5,0.5,-0.5
  
    ];
    vertices = new Array();
    indices = new Array();
    constructor()
    {
        for(let x=0;x<16;x++)
        {
            this.blocks[x] = new Array(16);
            for(let y=0;y<16;y++)
            {
                this.blocks[x][y] = new Array(16);
                for(let z=0;z<16;z++)
                {
                    this.blocks[x][y][z] =1;
                }   
            }
        }
        this.blocks[15][15][10]=0;
        this.blocks[15][15][9]=0;
        console.log(this.blocks);
        this.updateVerticesIndices();
    }
 
    updateVerticesIndices() 
    {
        let index= 0;
        for(let x=0;x<16;x++)
        {
            for(let y=0;y<16;y++)
            {
               
                for(let z=0;z<16;z++)
                {
                    let temp = new Array();
                    for(let i=0;i<SubChunk.defVertices.length;i+=3)
                    {
                        temp.push(SubChunk.defVertices[i]+x);
                        temp.push(SubChunk.defVertices[i+1]+y);
                        temp.push(SubChunk.defVertices[i+2]+z);
                    }
                    if(this.blocks[x][y][z]!=0)
                    {
                   if(x-1 <0 || this.blocks[x-1][y][z]!=1)
                    {
                    this.vertices = this.vertices.concat(temp.slice(24,36));
                    this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                    index+=4;
                    }
                    if(x+1 > 15 ||this.blocks[x+1][y][z]!=1)
                    {
                    this.vertices = this.vertices.concat(temp.slice(36,48));
                    this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                    index+=4;
                    }
                    if(y+1 > 15 ||this.blocks[x][y+1][z]!=1)
                    {
                    this.vertices = this.vertices.concat(temp.slice(60,72));
                    this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                    index+=4;
                    }
                    if(y-1 < 0 ||this.blocks[x][y-1][z]!=1)
                    {
                    this.vertices = this.vertices.concat(temp.slice(48,60));
                    this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                    index+=4;
                    }
                    if(z>15||this.blocks[x][y][z+1]!=1)
                    {
                    this.vertices = this.vertices.concat(temp.slice(12,24));
                    this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                    index+=4;
                    }
                    if(z<0||this.blocks[x][y][z-1]!=1)
                    {
                    this.vertices = this.vertices.concat(temp.slice(0,12));
                    this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                    index+=4;
                    }
                }
                }   
            }
        }
        console.log(this.indices);
        console.log(this.vertices);
    }
    render()
    {
        for(let x=0;x<16;x++)
        {
            for(let y=0;y<16;y++)
            {
                for(let z=0;z<16;z++)
                {
                    this.blocks[x][y][z] =1;
                }   
            }
        }
    }
}