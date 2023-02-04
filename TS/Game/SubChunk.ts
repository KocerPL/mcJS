import { Array3D } from "../Engine/Utils/Array3D.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { Main } from "../Main.js";
import { Block, blocks, dirAssoc, directions } from "./Block.js";
import { Chunk, DIR } from "./Chunk.js";
import { World } from "./World.js";
import { Mesh } from "./Mesh.js"
type SIDE = "left"| "right" | "bottom" | "top" | "back" | "front";

export class SubChunk
{
    public mesh:Mesh= new Mesh();//Mesh that contains all data needed for rendering  
    blocks:Array<Array<Array<Block>>>= new Array3D(16,16,16);//Array of blocks

    generated:boolean=false; //Is SubChunk already generated
    inReGeneration:boolean=false; //Is subchunk in regeneration state
    lightUpdate:boolean = false; //Is subchunk updating light
   // empty:boolean = true;    //Is subchunk empty

    chunk:Chunk; //parent Chunk of this subchunk
    pos:Vector;//subchunk position in world

    constructor(pos:Vector,chunk:Chunk)
    {
      //Setting up variables
      this.pos = pos;
      this.chunk = chunk;
     
    }
 preGenerate(heightmap) //Generation method
    {
      //setting position according to subchunk pos in world
      let yPos =this.pos.y*16;
      let xPos =this.pos.x*16;
      let zPos =this.pos.z*16;
     //Iterating for each block
     for(let x =0;x<16;x++) for(let y=0;y<16;y++) for(let z=0;z<16;z++)
     {
       let ah = World.getHeight(x+xPos,z+zPos)
       if(ah-3>=(y+yPos)) // if position lower than 3 blocks on heightmap
       {
        if(Math.round(Math.random()*10) ==1)  //Randomizing greenstone ores
         this.blocks[x][y][z]= new Block(4);
        else
         this.blocks[x][y][z]=new Block(3); //Setting stone
      }
       else if(ah-1>=(y+yPos))
       this.blocks[x][y][z]=new Block(1);//Setting Grass block
       else if(ah>=(y+yPos))
       {
         heightmap[x][z] = ah;
       this.blocks[x][y][z]=new Block(2);
      }
       else if( World.waterLevel>y+yPos)
       this.blocks[x][y][z]=new Block(-1);
       else if(!(this.blocks[x][y][z] instanceof Block))
       {
       this.blocks[x][y][z]=new Block(0);
       if(ah+1==(y+yPos))
       {
       this.blocks[x][y][z].lightLevel=15;
       this.blocks[x][y][z].lightDir = directions.SKYLIGHT;
       }
    }
    }
    this.generated=true;
    }
    postGenerate(heightmap)
    {
      /* TODO: implement post generation
      if(Math.round(Math.random()*100) ==1 &&  !(World.waterLevel>y+yPos))
      World.generateTree(new Vector(xPos+ x,y+yPos,zPos+ z));*/
    }
    //Subchunk update
  update()
    {
     // if(!this.generated) return;
      this.clearLight();
      this.updateLightLevels();
      this.updateVerticesIndices();
     
    }
    clearLight() // Clears any light in subchunk
    {
      let airCount =4096;
      for(let x=0;x<16; x++) for(let y=0;y<16; y++)for(let z=0;z<16; z++)
      {
        if(this.blocks[x][y][z].id>0) continue;
        if(this.blocks[x][y][z].id==0) airCount--;
        this.blocks[x][y][z].lightLevel=0;
        if(this.blocks[x][y][z].id==-2) this.blocks[x][y][z].id =0;
        this.blocks[x][y][z].lightFBlock=0;
        if(y+(this.pos.y*16)==this.chunk.heightmap[x][z]+1)
        {
          this.blocks[x][y][z].lightLevel=15;       
        }
      }
   //   if(airCount<1) this.empty=true; else this.empty=false;
    }
    getBlock(pos:Vector):Block // gets block at position relative to subchunk position
    {
      if(pos.x>-1 && pos.x<16 && pos.y>-1 && pos.y<16 && pos.z >-1 && pos.z<16)
      {
        return this.blocks[pos.x][pos.y][pos.z];
      }
      else
      {
        let transPos = new Vector(0,0,0);
        let func = (par) =>{
        if(pos[par]<0)
        {
        pos[par] =15
        transPos[par]=-1;
        return true;
        }else if(pos[par]>15)
        {
          pos[par]=0;
          transPos[par]=1;
          return true
        }
        return false;
      }
      if( func("x") || func("z")) //if block out of chunk
      {
       try 
       {
       if(transPos.x<0)
        return this.chunk.neighbours["NEG_X"].subchunks[this.pos.y].getBlock(pos);
        if(transPos.x>0)
        return this.chunk.neighbours["POS_X"].subchunks[this.pos.y].getBlock(pos);
        if(transPos.z<0)
        return this.chunk.neighbours["NEG_Z"].subchunks[this.pos.y].getBlock(pos);
        if(transPos.z>0)
        return this.chunk.neighbours["POS_Z"].subchunks[this.pos.y].getBlock(pos);
       }
       catch(error)
       {
       // console.log("Cannot get block of next subchunk!!",transPos);
       }
      }
      else if(func("y") )
      {
        try 
       {
       
        return this.chunk.subchunks[this.pos.y+transPos.y].getBlock(pos);
       }
       catch(error)
       {
       // console.log("Cannot get block of next subchunk!!",transPos.y+this.pos.y);
         return undefined;
       }
      }
    //  console.log("Cannot get block");
      return undefined;
      }
    }
    updateLightLevels() //Updates light levels in this subchunk
    {
     
      for(let x=0;x<16; x++)
      for(let y=0;y<16; y++)
      for(let z=0;z<16; z++)
      this.updateLightOneBlock(x,y,z);
      for(let x=15;x>-1; x--)
      for(let y=15;y>-1; y--)
      for(let z=15;z>-1; z--)
      this.updateLightOneBlock(x,y,z);
    }
    updateLightOneBlock(x:number,y:number,z:number) //Updates one block of light
    {
      let lightDir:number =directions.UNDEF;
      let light =0;
      let light2 =0;
      let theBlock = this.blocks[x][y][z];
      if(theBlock.id >0) return;
      let chunk = this.chunk;
      if(y+(this.pos.y*16)>= chunk.heightmap[x][z]+1)
      {
      light=15;
      lightDir = directions.SKYLIGHT;
    }
      let waterCount=0;
      let nearWater=0;
      let watDir =0; 
      if(y+(this.pos.y*16)< chunk.heightmap[x][z]+4)
      { 
    let side = (dir)=>
      {
        let vec = dirAssoc[dir];
        if((x+vec.x >=0 && y+vec.y >=0 && z+vec.z >=0 && x+vec.x <16 && y+vec.y <16 && z+vec.z <16) )
            {
              
        let block:Block = this.blocks[x+vec.x][y+vec.y][z+vec.z];
        if(block.id==10)
        {
   //       console.log("heh");
         light2 =15
        }
        else if(block.id<1 )
          {
            if( dir!=directions.NEG_Y )
            {
            if(block.id==-1 && dir!=directions.POS_Y)
            {
              watDir = dir;
               waterCount++;
             }   
             else if(block.id==-2)
             {
               if(dir==directions.NEG_Y)
               {
                nearWater=14
                watDir = dir;
               }
              else if(block.attribute[0]-1>nearWater)
               {
              nearWater=block.attribute[0]-1;
              watDir = dir;
               }
             }
            }
          if( light+1<block.lightLevel)
            {
            light = block.lightLevel-1;
              lightDir =dir;
          }
          if( light2+1<block.lightFBlock)
          {
          light2 = block.lightFBlock-1;
        }
        }
            }
            else
            {
              let subCpos = this.pos.copy();
              let inscPos =new Vector(x,y,z);
              if(vec.x<0)
              {
              subCpos.x-=1;
              inscPos.x= 15
              }
              else if(vec.x>0)
              {
              subCpos.x+=1;
              inscPos.x= 0
              }
              else if(vec.y<0)
              {
              subCpos.y-=1;
              inscPos.y= 15
              }
              else if(vec.y>0)
              {
              subCpos.y+=1;
              inscPos.y= 0
              }
              else if(vec.z<0)
              {
              subCpos.z-=1;
              inscPos.z= 15
              }
              else if(vec.z>0)
              {
              subCpos.z+=1;
              inscPos.z= 0
              }
              try {
              let block:Block = Main.getChunkAt(subCpos.x,subCpos.z).subchunks[subCpos.y].blocks[inscPos.x][inscPos.y][inscPos.z];
             
              if(block.id<1 )
              {
                if(block.id==-1 && dir!=directions.POS_Y)
            {
              watDir = dir;
               waterCount++;
             }   
             else if(block.id==-2)
             {
               if(dir==directions.NEG_Y)
               {
                nearWater=14
                watDir = dir;
               }
              else if(block.attribute[0]-1>nearWater)
               {
              nearWater=block.attribute[0]-1;
              watDir = dir;
               }
             }
              if( light+1<block.lightLevel)
                {
                light = block.lightLevel-1;
                  lightDir =dir;
              }
              if( light2+1<block.lightFBlock)
              {
              light2 = block.lightFBlock-1;
            }
          }
              }
              catch(error)
              {
              }
            }     
      };
      side(directions.NEG_X);
      side(directions.POS_X);
      side(directions.NEG_Y);
      side(directions.POS_Y);
      side(directions.NEG_Z);
      side(directions.POS_Z);
    }
    if(waterCount>1)
    theBlock.id=-1;
    else if(waterCount==1)
    {
    theBlock.id=-2;
    if(!(theBlock.attribute instanceof Array))
     theBlock.attribute = new Array();
    theBlock.attribute[0]=14;
    theBlock.attribute[1]=watDir;
    }
    else if(nearWater>0)
    {
      if(!(theBlock.attribute instanceof Array))
      theBlock.attribute = new Array();
      if(theBlock.id!=-2 && theBlock.id!=-1)
      {
      theBlock.id=-2;
      theBlock.attribute[0]=0
     
      }
      if(theBlock.attribute[0]<nearWater)
      {
      theBlock.attribute[0]=nearWater;
      theBlock.attribute[1]=watDir  
    }
    }
      theBlock.lightDir = lightDir;
      theBlock.lightLevel = light;
      theBlock.lightFBlock = light2;
    }
    //DONE: update vertices only tree sides
    updateVerticesOptimized(x,z,index)
    {
      let indices = new Array();
      let vertices = new Array();
      let textureCoords = new Array();
      let lightLevels = new Array();
      let fB = new Array();
      for(let y=0;y<16;y++)
      {
        let block = this.blocks[x][y][z];
        let temp = new Array();
        for(let i=0;i<SubChunk.defVertices.length;i+=3)
        {
            temp.push(SubChunk.defVertices[i]+x);
            temp.push(SubChunk.defVertices[i+1]+y+(this.pos.y*16));
            temp.push(SubChunk.defVertices[i+2]+z);
        }
        let side =(vec:Vector,vStart,side:SIDE)=>
        {
         // console.log(this.blocks);
         let testedBlock = this.getBlock(new Vector(vec.x+x,vec.y+y,vec.z+z));
         if(testedBlock==undefined) return;
          if(block.id <1 )
          {
         
         
           if(testedBlock.id>0)
           {
            vertices = vertices.concat(temp.slice(vStart,vStart+12));
            textureCoords = textureCoords.concat(SubChunk.getTextureCords(testedBlock, SubChunk.flip(side)));
            indices = indices.concat(index+2,index+1,index,index+2,index,index+3);
            lightLevels = lightLevels.concat(block.lightLevel,block.lightLevel,block.lightLevel,block.lightLevel);
            fB=fB.concat(block.lightFBlock,block.lightFBlock,block.lightFBlock,block.lightFBlock);
            index+=4;
            
           }          
        }
         else
         {
          if(testedBlock.id<1)
          {  
             vertices = vertices.concat(temp.slice(vStart,vStart+12));
             textureCoords = textureCoords.concat(SubChunk.getTextureCords(block, side));
             indices = indices.concat(index+2,index+1,index,index+2,index,index+3);
             lightLevels = lightLevels.concat(testedBlock.lightLevel,testedBlock.lightLevel,testedBlock.lightLevel,testedBlock.lightLevel);
             fB=fB.concat(testedBlock.lightFBlock,testedBlock.lightFBlock,testedBlock.lightFBlock,testedBlock.lightFBlock);
             index+=4;
            
          }
         }
      };
      side(new Vector(1,0,0),36,"left");
      side(new Vector(0,-1,0),48,"bottom");
      side(new Vector(0,0,-1),0,"back");



      }
      return {v:vertices,i:indices,c:textureCoords,ind:index,lL:lightLevels,fB:fB};
    }

   static flip(side:SIDE):SIDE
    {
      if(side=="back")
      return "front";
      else if(side=="bottom")
      return "top";
      else if(side=="left")
      return "right"
      else if(side=="front")
      return "back"
      else if(side=="top")
      return "bottom"
      else if(side=="right")
      return "left"; 
    }
    //DONE: update vertices One level blocks shorted
 
    
   updateVerticesIndices() 
    {
    
        let index= 0;
        this.mesh.reset();
        this.inReGeneration = true;
        for(let x=0;x<16;x++)
        {
            for(let z=0;z<16;z++)
            {
               
              let vic = this.updateVerticesOptimized(x,z,index);
         //    console.log(x,y,vic);
                
               this.mesh.vertices =    this.mesh.vertices.concat(vic.v);
            //  this.normals =   this.vertices.concat(vic.n);
          //  console.log(vic.lL);
                this.mesh.lightLevels = this.mesh.lightLevels.concat(vic.lL);
                this.mesh.indices =    this.mesh.indices.concat(vic.i);
                this.mesh.fb = this.mesh.fb.concat(vic.fB);
                this.mesh.tCoords = this.mesh.tCoords.concat(vic.c);
                index = vic.ind;
                //console.log("c:",this.colors);
           
            }
        }
       // console.timeEnd("Updating");
    //   if(this.indices.length>0)
      
        
        this.mesh.count = this.mesh.indices.length;
        this.lightUpdate =false;
        this.inReGeneration =false;
      
      //  console.log(this.vertices);
       // console.log(this.indices);
        //console.log(this.colors);
    }
    //Generates full subchunk of air
    genEmpty()
    {
      for(let x =0;x<16;x++)
      {
          for(let y=0;y<16;y++)
          {
      for(let z=0;z<16;z++)
      {
        this.blocks[x][y][z]= new Block(0);
      }
    }};
    this.generated=true;
    }
    static blockTextureCoords = Object.freeze({
        1:[
            0, 1.0,
            1.0, 1.0,
            1.0, 0.0,
            0.0, 0.0,
        ],
        2:[
            1.01, 1.0,
            1.99, 1.0,
            1.99, 0.0,
            1.01, 0.0,
        ],
        3:[
          2.01, 1.0,
          2.99, 1.0,
          2.99, 0.0,
          2.01, 0.0,
      ]
    });
    updateVerticesOneAir(x,y,index,heightmap,once)
    {
      let subUpdate:Array<SubChunk> = new Array();
      let indices = new Array();
      let vertices = new Array();
      let textureCoords = new Array();
      let lightLevels = new Array();
    //  let index = 0;
    //console.log(this.blocks[x][y],x,y);
      for(let z=0;z<16;z++)
      {
         
          if(this.blocks[x][y][z].id>0) continue;

          let todo = new Array();
          let temp = new Array();
          for(let i=0;i<SubChunk.defVertices.length;i+=3)
          {
              temp.push(SubChunk.defVertices[i]+x);
              temp.push(SubChunk.defVertices[i+1]+y);
              temp.push(SubChunk.defVertices[i+2]+z);
          }
          let light =0;
          if(y+(this.pos.y*16) == heightmap[x][z]+1)
          light=15;
          let side =(vec:Vector,vStart,side)=>
          {
           // console.log(this.blocks);
            
            if((x+vec.x >=0 && y+vec.y >=0 && z+vec.z >=0 && x+vec.x <16 && y+vec.y <16 && z+vec.z <16) )
            {
              if(this.blocks[x+vec.x][y+vec.y][z+vec.z].id>0)
              {
                todo.push(()=>{
            vertices = vertices.concat(temp.slice(vStart,vStart+12));
            textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x+vec.x][y+vec.y][z+vec.z],side));
            indices = indices.concat(index+2,index+1,index,index+2,index,index+3);
            lightLevels = lightLevels.concat(this.blocks[x][y][z].lightLevel,this.blocks[x][y][z].lightLevel,this.blocks[x][y][z].lightLevel,this.blocks[x][y][z].lightLevel);
            index+=4;
                });
              }
              else if(this.blocks[x+vec.x][y+vec.y][z+vec.z].lightLevel>light+1)
              {
                light=this.blocks[x+vec.x][y+vec.y][z+vec.z].lightLevel-1;
              }
            }
            else
            {
              
                let subCpos = this.pos.copy();
                let inscPos =new Vector(x,y,z);
                if(vec.x<0)
                {
                subCpos.x-=1;
                inscPos.x= 15
                }
                else if(vec.x>0)
                {
                subCpos.x+=1;
                inscPos.x= 0
                }
                else if(vec.y<0)
                {
                subCpos.y-=1;
                inscPos.y= 15
                }
                else if(vec.y>0)
                {
                subCpos.y+=1;
                inscPos.y= 0
                }
                else if(vec.z<0)
                {
                subCpos.z-=1;
                inscPos.z= 15
                }
                else if(vec.z>0)
                {
                subCpos.z+=1;
                inscPos.z= 0
                }
                try {
                  let chunk = Main.getChunkAt(subCpos.x,subCpos.z)
                let block:Block = chunk.subchunks[subCpos.y].blocks[inscPos.x][inscPos.y][inscPos.z];
                let subc =  chunk.subchunks[subCpos.y];
                if( block instanceof Block)
                if( block.id>0 )
                {
            //      console.log(block);
            todo.push(()=>{
              vertices = vertices.concat(temp.slice(vStart,vStart+12));
              textureCoords = textureCoords.concat(SubChunk.getTextureCords(block,side));
              indices = indices.concat(index+2,index+1,index,index+2,index,index+3);
              lightLevels = lightLevels.concat(this.blocks[x][y][z].lightLevel,this.blocks[x][y][z].lightLevel,this.blocks[x][y][z].lightLevel,this.blocks[x][y][z].lightLevel);
              index+=4;
            });
           
                }
                else if(block.lightLevel>light+1)
              {
                light=block.lightLevel-1;
              }
              if(!once && !subUpdate.includes(subc))
              subUpdate.push(subc);
              } catch (error) {
               
              }
            }
            
           // else
           // console.count("hehe");
           
          }
          side(new Vector(-1,0,0),24,"left");
          side(new Vector(1,0,0),36,"right");
          side(new Vector(0,-1,0),48,"top");
          side(new Vector(0,1,0),60,"bottom");
          side(new Vector(0,0,-1),0,"front");
          side(new Vector(0,0,1),12,"back");
          this.blocks[x][y][z].lightLevel = light;
          while(todo.length>0)
          {
            todo.shift()();
          }
          
       }
       while(subUpdate.length>0)
          {
            let sub = subUpdate.shift();
            if( sub.generated && !sub.inReGeneration )
            sub.updateVerticesIndices();
          }

    
    return {v:vertices,i:indices,c:textureCoords,ind:index,lL:lightLevels};
  }
    updateVerticesOneLevel(x,y,index,heightmap)
    {
        let indices = new Array();
        let vertices = new Array();
        let textureCoords = new Array();
        let lightLevels = new Array();
      //  let index = 0;
      //console.log(this.blocks[x][y],x,y);
        for(let z=0;z<16;z++)
        {
           
            if(this.blocks[x][y][z].id==0) continue;
            if(y >= heightmap[x][z])
            {
              this.blocks[x][y][z].lightLevel=15;
            }
            let temp = new Array();
            for(let i=0;i<SubChunk.defVertices.length;i+=3)
            {
                temp.push(SubChunk.defVertices[i]+x);
                temp.push(SubChunk.defVertices[i+1]+y);
                temp.push(SubChunk.defVertices[i+2]+z);
            }
          
           
           if(x-1 <0 || this.blocks[x-1][y][z].id<1)
            {
            vertices = vertices.concat(temp.slice(24,36));
            //normals = normals.concat(SubChunk.defNormals.slice(24,36));
            try
            {
            lightLevels =  lightLevels.concat(this.blocks[x-1][y][z].lightLevel,this.blocks[x-1][y][z].lightLevel,this.blocks[x-1][y][z].lightLevel,this.blocks[x-1][y][z].lightLevel);
          }
          catch(error)
          {
          }
            indices = indices.concat(index+2,index+1,index,index+2,index,index+3);
            textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z],"left"));
            index+=4;
            }
            if(x+1 > 15 ||this.blocks[x+1][y][z].id<1)
            {
            vertices = vertices.concat(temp.slice(36,48));
            //normals = normals.concat(SubChunk.defNormals.slice(36,48));
            try
            {
            lightLevels = lightLevels.concat(this.blocks[x+1][y][z].lightLevel,this.blocks[x+1][y][z].lightLevel,this.blocks[x+1][y][z].lightLevel,this.blocks[x+1][y][z].lightLevel);
          }
          catch(error)
          {
          }
            indices = indices.concat(index+1,index+2,index,index+3,index,index+2);
            textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z],"right"));
            index+=4;
            }
            if(y+1 > 15 ||this.blocks[x][y+1][z].id<1)
            {
            vertices = vertices.concat(temp.slice(60,72));
            //normals = normals.concat(SubChunk.defNormals.slice(60,72));
            try
            {
            lightLevels = lightLevels.concat(this.blocks[x][y+1][z].lightLevel,this.blocks[x][y+1][z].lightLevel,this.blocks[x][y+1][z].lightLevel,this.blocks[x][y+1][z].lightLevel);
          }
          catch(error)
          {
          }
            indices = indices.concat(index+2,index+1,index,index+2,index,index+3);
            textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z],"top"));
            index+=4;
            }
            if(y-1 < 0 ||this.blocks[x][y-1][z].id<1)
            {
            vertices = vertices.concat(temp.slice(48,60));
            //normals = normals.concat(SubChunk.defNormals.slice(48,60));
            try
            {
            lightLevels =  lightLevels.concat(this.blocks[x][y-1][z].lightLevel,this.blocks[x][y-1][z].lightLevel,this.blocks[x][y-1][z].lightLevel,this.blocks[x][y-1][z].lightLevel);
          }
          catch(error)
          {
          }
            indices = indices.concat(index+1,index+2,index,index+3,index,index+2);
            textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z],"bottom"));
            index+=4;
            }
            if(z+1>15||this.blocks[x][y][z+1].id<1)
            {
            vertices = vertices.concat(temp.slice(12,24));
            //normals = normals.concat(SubChunk.defNormals.slice(12,24));
            try
            {
            lightLevels =  lightLevels.concat(this.blocks[x][y][z+1].lightLevel,this.blocks[x][y][z+1].lightLevel,this.blocks[x][y][z+1].lightLevel,this.blocks[x][y][z+1].lightLevel);
          }
          catch(error)
          {
          }
            indices = indices.concat(index+2,index+1,index,index+2,index,index+3);
            textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z],"front"));
            index+=4;
            }
            if(z-1 <0||this.blocks[x][y][z-1].id<1)
            {
            vertices = vertices.concat(temp.slice(0,12));
            //normals = normals.concat(SubChunk.defNormals.slice(0,12));
            try
            {
           lightLevels =  lightLevels.concat(this.blocks[x][y][z-1].lightLevel,this.blocks[x][y][z-1].lightLevel,this.blocks[x][y][z-1].lightLevel,this.blocks[x][y][z-1].lightLevel);
            }
            catch(error)
            {
            }
            indices = indices.concat(index+1,index+2,index,index+3,index,index+2);
            textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z],"back"));
          //  console.log("z");
            index+=4;
            }
          
        }   
        return {v:vertices,i:indices,c:textureCoords,ind:index,lL:lightLevels};
    }
    static getTextureCords(block,face) {
      let index = blocks[block.id].textureIndex[face];
   let temp =   [
      0.0, 1.0, index,
        1.0, 1.0, index,
        1.0, 0.0,index,
        0.0, 0.0,index
    ];
        return temp;
    }
    static getTextureCords2(blockID,face) {
      let index = blocks[blockID].textureIndex[face];
   let temp =   [
      0.0, 1.0, index,
        1.0, 1.0, index,
        1.0, 0.0,index,
        0.0, 0.0,index
    ];
        return temp;
    }
  static  getRandColor(x,y,z)
    {
      return[ 0.0,0.0,
        0.0,1.0,
        1.0,1.0,
        1.0,0.0,
    ] ;
    }
        
    static defArrow = [
      //Facing POS_Z
      0.2,0,-0.2,
      0,0,0.3,
      -0.2,0,-0.2,
      //Facing NEG_Z
      0.2,0,0.2,
      0,0,-0.3,
      -0.2,0,0.2,
       //Facing POS_X
       -0.2, 0,0.2,
       0.3, 0, 0,
      -0.2, 0,-0.2,
       //Facing NEG_X
      0.2,0, 0.2,
       -0.3,0,0,
       0.2,0,-0.2,
        //Facing POS_Y
        0,-0.2,0.2,
        0,0.3,  0,
       0,-0.2, -0.2,
        //Facing NEG_Y
       0,0.2, 0.2,
        0,-0.3,0,
        0,0.2,-0.2
    ]
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

}