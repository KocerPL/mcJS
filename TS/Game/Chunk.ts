import { CanvaManager } from "../Engine/CanvaManager.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { Main } from "../Main.js";
import { Block } from "./Block.js";
import { SubChunk } from "./SubChunk.js"
let gl = CanvaManager.gl;
export type DIR = "POS_X" | "POS_Z" | "NEG_X"  | "NEG_Z";
export class Chunk {
  subchunks: Array<SubChunk> = new Array(16);
  todo: Array<Function> = new Array();
  heightmap: Array<Array<number>> = new Array(16);
  neighbours:{POS_X?:Chunk,POS_Z?:Chunk,NEG_X?:Chunk,NEG_Z?:Chunk}={};
  lazy:boolean =false;
  pos:Vector;
  constructor(x:number, z:number,isLazy:boolean) {
    // console.log("Constructing chunk");
    this.pos = new Vector(x,0,z);
    for(let i =0; i<16;i++)
    {
      this.heightmap[i] = new Array(16);
    }
    for (let i = 0; i < this.subchunks.length; i++) {
     this.subchunks[i] = new SubChunk(new Vector(x, i, z),this.heightmap,this);
      //console.log("Completed generating subchunk: "+i);
    }
    this.sendNeighbours();
    // console.log("done constructing");
  }
  updateNeighbour(neigbDir:DIR,chunk:Chunk)
  {
    if(chunk==undefined) return;
    this.neighbours[neigbDir] =chunk;
  }
  gatherNeighbours()
  {
    try
    {
    let neighbour = Main.getChunkAt(this.pos.x-1,this.pos.z);
    this.updateNeighbour("NEG_X",neighbour);
    }
    catch(error)
    {

    }
    try{
   
 let   neighbour = Main.getChunkAt(this.pos.x+1,this.pos.z);
 this.updateNeighbour("POS_X",neighbour);
  }
  catch(error)
  {

  }
  try{
   let neighbour = Main.getChunkAt(this.pos.x,this.pos.z-1);
   this.updateNeighbour("NEG_Z",neighbour);
  }
  catch(error)
  {

  }
  try{
  let  neighbour = Main.getChunkAt(this.pos.x,this.pos.z+1);
  this.updateNeighbour("POS_Z",neighbour);
    } 
    catch(error)
    {
      
    }
  }
  sendNeighbours()
  {
    try
    {
    let neighbour = Main.getChunkAt(this.pos.x-1,this.pos.z);
    neighbour.updateNeighbour("POS_X",this);
    }
    catch(error)
    {

    }
    try{
   
 let   neighbour = Main.getChunkAt(this.pos.x+1,this.pos.z);
    neighbour.updateNeighbour("NEG_X",this);
  }
  catch(error)
  {

  }
  try{
   let neighbour = Main.getChunkAt(this.pos.x,this.pos.z-1);
    neighbour.updateNeighbour("POS_Z",this);
  }
  catch(error)
  {

  }
  try{
  let  neighbour = Main.getChunkAt(this.pos.x,this.pos.z+1);
    neighbour.updateNeighbour("NEG_Z",this);
    } 
    catch(error)
    {
      
    }
  }
  update(startTime: number) {
    let actualTime = Date.now();

  
  }
  render() {
    if(!this.lazy)
    for (let i = 0; i < this.subchunks.length; i++) {
      if (this.subchunks[i] != undefined && this.subchunks[i].generated && this.subchunks[i].count>0) {
        this.subchunks[i].vao.bind();
       Main.shader.loadTransformation(this.subchunks[i].transformation);
       //console.log(this.subchunks[i].count);
        gl.drawElements(gl.TRIANGLES, this.subchunks[i].count, gl.UNSIGNED_INT, 0);
      }
      
    }
  }
  renderWater() {
    if(!this.lazy)
    for (let i = 0; i < this.subchunks.length; i++) {
      if (this.subchunks[i] != undefined && this.subchunks[i].generated && this.subchunks[i].RsWater.count>0) {
        this.subchunks[i].RsWater.vao.bind();
        Main.shader.loadUniforms(Main.player.camera.getProjection(), this.subchunks[i].transformation, Main.player.camera.getView(),Main.sunLight);
     //  console.log( this.subchunks[i].RsWater.count);
       
        gl.drawElements(gl.TRIANGLES, this.subchunks[i].RsWater.count, gl.UNSIGNED_INT, 0);
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
      if(! (this.subchunks[yPos].blocks[pos.x][y][pos.z] instanceof Block))
      this.subchunks[yPos].blocks[pos.x][y][pos.z] =new Block(0);
  //  console.log(this.subchunks[yPos].blocks[pos.x][y][pos.z]);
    return this.subchunks[yPos].blocks[pos.x][y][pos.z];
    }
    throw new Error("Undefined subchunk! ");
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
      if(! (this.subchunks[yPos].blocks[pos.x][y][pos.z] instanceof Block))
      this.subchunks[yPos].blocks[pos.x][y][pos.z] =new Block(0);
    this.subchunks[yPos].blocks[pos.x][y][pos.z].lightLevel=lightLevel;
    }
    else
    {
      console.log("Subchunk is undefined");
    }
   
  }
  generate()
  {
    
    for (let i = 0; i < this.subchunks.length; i++) {
    
      this.subchunks[i].generate(new Vector(this.pos.x,i,this.pos.z),this.heightmap);
    }
   // this.lazy=false;

  }
  updateAllSubchunks(priority:number)
  {
     if(this.neighbours.NEG_X==undefined || this.neighbours.POS_X==undefined || this.neighbours.POS_Z==undefined || this.neighbours.NEG_Z==undefined  ) 
     {
       this.gatherNeighbours();
       if(this.neighbours.NEG_X==undefined || this.neighbours.POS_X==undefined || this.neighbours.POS_Z==undefined || this.neighbours.NEG_Z==undefined  ) 
      return;
     } 
    for (let i = 0; i < this.subchunks.length; i++) {
    
      this.subchunks[i].update(priority);
    }
    this.lazy=false;
    console.log("now not lazy hehehehe")
  }
  getSubchunk(y)
  {
    let yPos = Math.floor(Math.round(y)/16);
    if(this.subchunks[yPos]!= undefined)
   return this.subchunks[yPos];
  }
  updateSubchunkAt(y)
  {
    let yPos = Math.floor(Math.round(y)/16);
    if(this.subchunks[yPos].generated)
   this.subchunks[yPos].update(10,true);
  }
  setBlock(pos:Vector,blockID:number,update?:boolean)
  {
    if (pos.x < 0 || pos.y < 0 || pos.z < 0 || pos.x > 16 || pos.y > 256 || pos.z > 16) {
      throw new Error("Incorrect cordinates");
    }
    let y = pos.y%16;
    
    let yPos = Math.floor(Math.round(pos.y)/16);
    if(this.subchunks[yPos]!=undefined )//&& this.subchunks[yPos].generated==true)
    {
      if(! (this.subchunks[yPos].blocks[pos.x][y][pos.z] instanceof Block))
      this.subchunks[yPos].blocks[pos.x][y][pos.z] =new Block(0);
    this.subchunks[yPos].blocks[pos.x][y][pos.z].id=blockID;
    if(update!=undefined || update==true)
    this.updateSubchunkAt(pos.y);
    
    try
    {
    if(pos.x ==0)
    {
     Main.getChunkAt(this.pos.x-1, this.pos.z).subchunks[yPos].update(10);
    }
   else if(pos.x ==15)
    {
      Main.getChunkAt(this.pos.x+1, this.pos.z).subchunks[yPos].update(10);
    }
    if(y ==0)
    {
      Main.getChunkAt(this.pos.x, this.pos.z).subchunks[yPos-1].update(10);
    }
   else if(y ==15)
    {
      Main.getChunkAt(this.pos.x, this.pos.z).subchunks[yPos+1].update(10);
    }
    if(pos.z ==0)
    {
      Main.getChunkAt(this.pos.x, this.pos.z-1).subchunks[yPos].update(10);
    }
   else if(pos.z ==15)
    {
      Main.getChunkAt(this.pos.x, this.pos.z+1).subchunks[yPos].update(10);
    }
  }
  catch(error)
  {
   // console.log(error);
  }
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
    this.subchunks[yPos].update(10);
    }
    else console.log("undefined Chunk!");
  }

}