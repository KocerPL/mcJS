import { CanvaManager } from "../Engine/CanvaManager.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { Main } from "../Main.js";
import { Block } from "./Block.js";
import { SubChunk } from "./SubChunk.js"
let gl = CanvaManager.gl;
export class Chunk {
  subchunks: Array<SubChunk> = new Array(16);
  todo: Array<Function> = new Array();
  heightmap: Array<Array<number>> = new Array(16);
  constructor(x, z) {
    // console.log("Constructing chunk");
    for(let i =0; i<16;i++)
    {
      this.heightmap[i] = new Array(16);
    }
    for (let i = 0; i < this.subchunks.length; i++) {
      this.todo.push(() => { this.subchunks[i] = new SubChunk(new Vector(x, i, z),this.heightmap); });
      //console.log("Completed generating subchunk: "+i);
    }
    // console.log("done constructing");
  }
  update(startTime: number) {
    let actualTime = Date.now();

    while (this.todo.length > 0 && actualTime - 200 < startTime) {
      actualTime = Date.now();
      //console.log(actualTime);
      let work = this.todo.shift();
      work();
    }
  }
  render() {
  
    for (let i = 0; i < this.subchunks.length; i++) {
      if (this.subchunks[i] != undefined && this.subchunks[i].generated) {
        this.subchunks[i].vao.bind();
        Main.shader.loadUniforms(Main.player.camera.getProjection(), this.subchunks[i].transformation, Main.player.camera.getView(),Main.sunPos);
       //console.log(this.subchunks[i].count);
        gl.drawElements(gl.TRIANGLES, this.subchunks[i].count, gl.UNSIGNED_INT, 0);
      }
    }
  }
  getBlock(pos:Vector):Block {
    if (pos.x < 0 || pos.y < 0 || pos.z < 0 || pos.x > 15 || pos.y > 256 || pos.z > 15) {
      throw new Error("Incorrect cordinates: x:"+pos.x+" y:"+pos.y+" z:"+pos.z );
    }
    let y = pos.y%16;
    let yPos = Math.floor(pos.y/16);
    if(this.subchunks[yPos]!=undefined)
    {
    return this.subchunks[yPos].blocks[pos.x][y][pos.z];
    }
  }
  setLight(pos:Vector,lightLevel:number)
  {
    if (pos.x < 0 || pos.y < 0 || pos.z < 0 || pos.x > 16 || pos.y > 256 || pos.z > 16) {
      throw new Error("Incorrect cordinates");
    }
    let y = pos.y%16;
  
    let yPos = Math.floor(Math.round(pos.y)/16);
    if(this.subchunks[yPos]!=undefined)
    {
    this.subchunks[yPos].blocks[pos.x][y][pos.z].lightLevel=lightLevel;
    }
    else
    {
      console.log("Subchunk is undefined");
    }
   
  }
  getSubchunk(y)
  {
    let yPos = Math.floor(Math.round(y)/16);
   return this.subchunks[yPos];
  }
  updateSubchunkAt(y)
  {
    let yPos = Math.floor(Math.round(y)/16);
    this.subchunks[yPos].updateVerticesIndices(10,this.heightmap);
  }
  setBlock(pos:Vector,blockID:number)
  {
    if (pos.x < 0 || pos.y < 0 || pos.z < 0 || pos.x > 16 || pos.y > 256 || pos.z > 16) {
      throw new Error("Incorrect cordinates");
    }
    let y = pos.y%16;
  
    let yPos = Math.floor(Math.round(pos.y)/16);
    if(this.subchunks[yPos]!=undefined && this.subchunks[yPos].generated==true)
    {
    this.subchunks[yPos].blocks[pos.x][y][pos.z].id=blockID;
    this.updateSubchunkAt(pos.y);
    }
    else
    {
      console.log("Subchunk is undefined");
    }
   
  }
  setBlock2(pos:Vector, blockID) {
    if (pos.x < 0 || pos.y < 0 || pos.z < 0 || pos.x > 16 || pos.y > 256 || pos.z > 16) {
      throw new Error("Incorrect cordinates");
    }
    let y = pos.y%16;
  
    let yPos = Math.floor(Math.round(pos.y)/16);
    console.log(yPos);
    if(this.subchunks[yPos]!=undefined)
    {
    this.subchunks[yPos].blocks[pos.x][y][pos.z].id=blockID;
    try
    {
      if(yPos+y>=this.heightmap[pos.x][pos.z] )
      {
        this.heightmap[pos.x][pos.z]=(yPos+y)-1;
        let blockId =  this.subchunks[yPos].blocks[pos.x][y-1][pos.z].id;
        this.subchunks[yPos].blocks[pos.x][y-1][pos.z].lightLevel=15; 
        this.subchunks[yPos].blocks[pos.x-1][y-1][pos.z].lightLevel=13; 
          this.subchunks[yPos].blocks[pos.x+1][y-1][pos.z].lightLevel=13;
          this.subchunks[yPos].blocks[pos.x][y-1][pos.z+1].lightLevel=13;
          this.subchunks[yPos].blocks[pos.x][y-1][pos.z-1].lightLevel=13;   
        let tempPos = 0;
        while(blockId<1)
        {
          tempPos+=1;
          this.heightmap[pos.x][pos.z]=(yPos+y)-tempPos;
          blockID =    this.subchunks[yPos].blocks[pos.x][y-tempPos][pos.z].id;
          this.subchunks[yPos].blocks[pos.x][y-tempPos][pos.z].lightLevel=15; 
          this.subchunks[yPos].blocks[pos.x-1][y-tempPos][pos.z].lightLevel=13-tempPos; 
          this.subchunks[yPos].blocks[pos.x+1][y-tempPos][pos.z].lightLevel=13-tempPos;
          this.subchunks[yPos].blocks[pos.x][y-tempPos][pos.z+1].lightLevel=13-tempPos;
          this.subchunks[yPos].blocks[pos.x][y-tempPos][pos.z-1].lightLevel=13-tempPos;   
        }
      }
      else
      {
        let light =   this.subchunks[yPos].blocks[pos.x][y][pos.z].lightLevel;
        if( this.subchunks[yPos].blocks[pos.x+1][y][pos.z].lightLevel < light-1)
        this.subchunks[yPos].blocks[pos.x+1][y][pos.z].lightLevel=light-1; 
        if( this.subchunks[yPos].blocks[pos.x-1][y][pos.z].lightLevel < light-1)
        this.subchunks[yPos].blocks[pos.x-1][y][pos.z].lightLevel=light-1; 
        if( this.subchunks[yPos].blocks[pos.x][y][pos.z-1].lightLevel < light-1)
          this.subchunks[yPos].blocks[pos.x][y][pos.z-1].lightLevel=light-1;
          if( this.subchunks[yPos].blocks[pos.x][y][pos.z+1].lightLevel < light-1)
          this.subchunks[yPos].blocks[pos.x][y][pos.z+1].lightLevel=light-1;
          if( this.subchunks[yPos].blocks[pos.x][y-1][pos.z].lightLevel < light-1)
          this.subchunks[yPos].blocks[pos.x][y-1][pos.z].lightLevel=light-1;   
          if( this.subchunks[yPos].blocks[pos.x][y+1][pos.z].lightLevel < light-1)
          this.subchunks[yPos].blocks[pos.x][y+1][pos.z].lightLevel=light-1; 
      }
    }
    catch(error)
    {
      
    }
    this.subchunks[yPos].updateVerticesIndices(10,this.heightmap);
    }
    else console.log("undefined Chunk!");
  }

}