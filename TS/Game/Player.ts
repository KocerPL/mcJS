import { Camera } from "../Engine/Camera.js";
import { CanvaManager } from "../Engine/CanvaManager.js";
import { EBO } from "../Engine/EBO.js";
import { RenderSet } from "../Engine/RenderSet.js";
import { Task } from "../Engine/Task.js";
import { Texture } from "../Engine/Texture.js";
import { Matrix } from "../Engine/Utils/Matrix.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { VAO } from "../Engine/VAO.js";
import { VBO } from "../Engine/VBO.js";
import { Main } from "../Main.js";
import { Block, blocks, dirAssoc } from "./Block.js";
import { Item } from "./entities/Item.js";
import { SubChunk } from "./SubChunk.js";
import { World } from "./World.js";
let gl = CanvaManager.gl;
export type pers = "First" | "Second" |"Third";
export class invItem 
{
    id:number;
    count:number;

    constructor(id)
    {
        this.id=id;
        this.count=1;
    }
}
export class Player
{
//model



    camera:Camera = new Camera();
    pos:Vector;
    inWater:boolean;
    itemsBar:Array<invItem>=new Array(9);
    inventory:Array<invItem>=new Array(27);
    locked:boolean=false;
    targetedBlock=null;
    startTime=0;
    tbPos = new Vector(0,0,0);
    blockOverlay:RenderSet = new RenderSet();
    blockBreakingTime=0;
    selectedItem = 0;
    person:pers ="First"; 
    vao:VAO;
    vbo:VBO;
    vtc:VBO;
    vlo:VBO;
    ebo:EBO;
    yAcc =0.01;
   mainAcc=0.1;
   static blVertices =[
    //przód
    -0.55,-0.55,-0.55,
    0.55,-0.55,-0.55,
    0.55,0.55,-0.55,
    -0.55,0.55,-0.55,
    //tył
    -0.55,-0.55,0.55,
    0.55,-0.55,0.55,
    0.55,0.55,0.55,
    -0.55,0.55,0.55,
    //lewo
    -0.55,-0.55,-0.55,
    -0.55,-0.55,0.55,
    -0.55,0.55 ,0.55,
    -0.55,0.55,-0.55,
    //prawo
    0.55,-0.55,-0.55,
    0.55,-0.55,0.55,
    0.55,0.55 ,0.55,
    0.55,0.55,-0.55,
    //dół
    -0.55,-0.55,-0.55,
    -0.55,-0.55,0.55,
    0.55,-0.55 ,0.55,
    0.55,-0.55,-0.55,
    //góra
    -0.55,0.55,-0.55,
    -0.55,0.55,0.55,
    0.55,0.55 ,0.55,
    0.55,0.55,-0.55

];
    rotX=0;
    rotY=0;
    jump ={
        time:0,
        yAcc:0,

    }
    constructor(pos:Vector)
    {
        this.pos = pos;
        this.camera.setPosition(new Vector(pos.x,pos.y+1,pos.z));
        for(let i=0;i<9;i++)
        this.itemsBar[i]= new invItem(0);
        for(let i=0;i<27;i++)
        this.inventory[i]= new invItem(0);
        this.vao = new VAO();
        this.vbo = new VBO();
      
        this.vao.addPtr(0,3,0,0);
        this.vtc = new VBO();
       
        this.vao.addPtr(1,2,0,0);
        this.vlo = new VBO();
     
        this.vao.addPtr(2,1,0,0);
        this.ebo = new EBO();
      
        VAO.unbind();
        VBO.unbind();
        EBO.unbind();
        this.bufferVertexes();
    }
    update()
    {
        if(this.targetedBlock instanceof Block)
        {
            let vertices =new Array();
            vertices= vertices.concat(Player.blVertices)
            for(let i=0;i<vertices.length;i+=3)
            {
                vertices[i] =vertices[i]+this.tbPos.x;
                vertices[i+1] =vertices[i+1]+this.tbPos.y;
                vertices[i+2] =vertices[i+2]+this.tbPos.z;
            }
            let index = 5-Math.round((((Date.now()/1000)-this.startTime)/blocks[this.targetedBlock.id].breakTime)*5); 
            let indices = new Array();
            let light=new Array();
            let textureCoords = new Array();
            for(let i=0;i<6;i++)
            {
                textureCoords= textureCoords.concat([0.0, 1.0, index,
                    1.0, 1.0, index,
                    1.0, 0.0,index,
                    0.0, 0.0,index]);
                light=    light.concat([14,14,14,14]);
                let k = 4*i;
               indices= indices.concat([2+k,1+k,k,2+k,0+k,3+k])
            }

       this.blockOverlay.bufferArrays(vertices,textureCoords,light,indices);
        }
        else
        this.blockOverlay.count=0;
        this.updatePos();
    }
  bufferVertexes()
    {
        this.vao.bind();
        this.vbo.bufferData([...SubChunk.defVertices, -0.5,-0.7,-0.2,
            0.5,-0.7,-0.2,
            0.5,0.7,-0.2,
            -0.5,0.7,-0.2,
            -0.5,-0.7,0.2,
            0.5,-0.7,0.2,
            0.5,0.7,0.2,
            -0.5,0.7,0.2, ]);
        this.vlo.bufferData([14,14,14,14 ,14,14,14,14 ,14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, /*Body */, 14,14,14,14, 14,14,14,14]);
     let tc = new Array();
   
        let pushFunc = (ind)=>{
         tc=   tc.concat([
    Texture.skinAtlas.coords[ind].x, Texture.skinAtlas.coords[ind].dy,
    Texture.skinAtlas.coords[ind].dx, Texture.skinAtlas.coords[ind].dy,
    Texture.skinAtlas.coords[ind].dx, Texture.skinAtlas.coords[ind].y,
    Texture.skinAtlas.coords[ind].x, Texture.skinAtlas.coords[ind].y]);
   }
   pushFunc(1);
   pushFunc(0);
   pushFunc(2);
   pushFunc(3);
   pushFunc(5);
   pushFunc(4);
   pushFunc(7);
   pushFunc(6);
           this.vtc.bufferData(tc);
           let array=new Array();
        for(let i=0;i<7;i++)
        {
            let k = 4*i;
            array.concat([2+k,1+k,k,2+k,0+k,3+k])
        }
           this.ebo.bufferData([2,1,0,2,0,3
            ,6,5,4,6,4,7, 10,9,8,10,8,11, 14,13,12,14,12,15, 18,17,16,18,16,19, 22,21,20,22,20,23,/**Body */ 26,25,24,26,24,27, 30,29,28,30,28,31]);
            VAO.unbind();
    }
    switchPerson(person:pers)
    {
        if(person== this.person) return;
        this.person = person;
        this.camera.projRot = 0;
        if(person=="Third")
        this.camera.offset = 5;
        else if(person=="Second")
        {
        this.camera.offset = -5;
        this.camera.projRot = 180;
        }
        else 
        this.camera.offset = 0;
    }
    updatePos()
    {
        if(this.locked) return;
        let hop =false;
        let tempPos = this.pos.copy();
        if(this.jump.yAcc>0)
        {
            this.jump.yAcc-=0.015;
           tempPos.y+=this.jump.yAcc;
            this.jump.time--;
            hop=true;
            this.yAcc=0;
        }
        let speed=1;
        try
        {
            if(CanvaManager.getKeyOnce(81))
            {
               
            Main.entities.push(new Item(this.camera.getPosition().copy(),this.itemsBar[this.selectedItem].id));
            this.itemsBar[this.selectedItem].count--;
            if( this.itemsBar[this.selectedItem].count<1)
            this.itemsBar[this.selectedItem].id=0;
                console.log("heh");
        }
            if(CanvaManager.getKey(16))
        speed=2;
        if(CanvaManager.getKey(87))
        {
            tempPos.x+=Math.sin(this.camera.getYaw()*Math.PI/180)*0.1*speed;
            tempPos.z +=Math.cos(this.camera.getYaw()*Math.PI/180)*0.1*speed;
        }
        else if(CanvaManager.getKey(83))
        {
            tempPos.x-=Math.sin(this.camera.getYaw()*Math.PI/180)*0.1;
            tempPos.z-=Math.cos(this.camera.getYaw()*Math.PI/180)*0.1;
        }
        if(CanvaManager.getKey(68))
        {
            tempPos.x+=Math.sin((this.camera.getYaw()+90)*Math.PI/180)*0.1;
            tempPos.z+=Math.cos((this.camera.getYaw()+90)*Math.PI/180)*0.1;
        }
        else if(CanvaManager.getKey(65))
        {
           

           tempPos.x-=Math.sin((this.camera.getYaw()+90)*Math.PI/180)*0.1;
            tempPos.z-=Math.cos((this.camera.getYaw()+90)*Math.PI/180)*0.1;
            
        }
        let block =World.getBlock(this.camera.getPosition());
        if(block.id <0)
        {
        this.inWater =true;
        
        }
        else 
        this.inWater=false;
        block =World.getBlock(new Vector(Math.round(tempPos.x),Math.round(tempPos.y-0.5),Math.round(tempPos.z)));
        let block2 = World.getBlock(this.camera.getPosition());
        if(block.id==-2 )
        {
            let vec = dirAssoc[block.attribute[1]];
             tempPos = Vector.add(tempPos,vec.mult(-(0.1* (block.attribute[0]/15))));
        } else if(block2.id==-2)
        {
            let vec = dirAssoc[block2.attribute[1]];
             tempPos = Vector.add(tempPos,vec.mult(-(0.05* (block2.attribute[0]/15))));
        }
        let down = false
        if( World.getBlock( new Vector(Math.round(tempPos.x-0.3),Math.round(tempPos.y-0.5),Math.round(tempPos.z)) ).id <1 
        && World.getBlock( new Vector(Math.round(tempPos.x+0.3),Math.round(tempPos.y-0.5),Math.round(tempPos.z)) ).id <1)
        {
          //  down=false;
        }
        else
        {
        tempPos.x = this.pos.x;
        down=true;    
    }
        if( World.getBlock( new Vector(Math.round(tempPos.x),Math.round(tempPos.y-0.5),Math.round(tempPos.z+0.3)) ).id <1
        && World.getBlock( new Vector(Math.round(tempPos.x),Math.round(tempPos.y-0.5),Math.round(tempPos.z-0.3)) ).id <1 )
        {
           // down=false;
        }
        else
        {
       down=true;
        tempPos.z = this.pos.z;
        }
        if( !(  World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y+1.5),Math.round(this.pos.z)) ).id<1
            && World.getBlock( new Vector(Math.round(this.pos.x+0.3),Math.round(this.pos.y+1.5),Math.round(this.pos.z))).id<1
                && World.getBlock( new Vector(Math.round(this.pos.x-0.3),Math.round(this.pos.y+1.5),Math.round(this.pos.z))).id<1
                && World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y+1.5),Math.round(this.pos.z+0.3))).id<1
                && World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y+1.5),Math.round(this.pos.z-0.3))).id<1))
                {
                    tempPos.y = this.pos.y;
                    this.jump.yAcc=0;
                }
                if( World.getBlock( new Vector(Math.round(tempPos.x-0.3),Math.round(tempPos.y+0.5),Math.round(tempPos.z)) ).id >0 
                || World.getBlock( new Vector(Math.round(tempPos.x+0.3),Math.round(tempPos.y+0.5),Math.round(tempPos.z)) ).id >0)
                tempPos.x = this.pos.x;
               if(World.getBlock( new Vector(Math.round(tempPos.x),Math.round(tempPos.y+0.5),Math.round(tempPos.z+0.3)) ).id >0
                || World.getBlock( new Vector(Math.round(tempPos.x),Math.round(tempPos.y+0.5),Math.round(tempPos.z-0.3)) ).id >0 )
                tempPos.z = this.pos.z;
         if( World.getBlock( new Vector(Math.round(tempPos.x-0.3),Math.round(tempPos.y+0.5),Math.round(tempPos.z)) ).id <1 
        && World.getBlock( new Vector(Math.round(tempPos.x+0.3),Math.round(tempPos.y+0.5),Math.round(tempPos.z)) ).id <1
        && World.getBlock( new Vector(Math.round(tempPos.x),Math.round(tempPos.y+0.5),Math.round(tempPos.z+0.3)) ).id <1
        && World.getBlock( new Vector(Math.round(tempPos.x),Math.round(tempPos.y+0.5),Math.round(tempPos.z-0.3)) ).id <1 )
        {
            if(   World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y+1.5),Math.round(this.pos.z)) ).id<1
            && World.getBlock( new Vector(Math.round(this.pos.x+0.3),Math.round(this.pos.y+1.5),Math.round(this.pos.z))).id<1
                && World.getBlock( new Vector(Math.round(this.pos.x-0.3),Math.round(this.pos.y+1.5),Math.round(this.pos.z))).id<1
                && World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y+1.5),Math.round(this.pos.z+0.3))).id<1
                && World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y+1.5),Math.round(this.pos.z-0.3))).id<1)
            {
               
           
             if(down && this.jump.yAcc<=0&&  World.getBlock( new Vector(Math.round(tempPos.x),Math.round(tempPos.y-1.5),Math.round(tempPos.z)) ).id>0)
                        {

            this.jump.yAcc=0.2;
            }
        }
           
     }
     if(!(World.getBlock(new Vector(Math.round(tempPos.x+0.3),Math.round(tempPos.y+0.5),Math.round(tempPos.z+0.3))).id>0 ||
      World.getBlock(new Vector(Math.round(tempPos.x-0.3),Math.round(tempPos.y+0.5),Math.round(tempPos.z+0.3))).id>0 ||
      World.getBlock(new Vector(Math.round(tempPos.x-0.3),Math.round(tempPos.y+0.5),Math.round(tempPos.z-0.3))).id>0 ||
      World.getBlock(new Vector(Math.round(tempPos.x+0.3),Math.round(tempPos.y+0.5),Math.round(tempPos.z-0.3))).id>0 ||
      World.getBlock(new Vector(Math.round(tempPos.x+0.3),Math.round(tempPos.y-0.5),Math.round(tempPos.z+0.3))).id>0 ||
      World.getBlock(new Vector(Math.round(tempPos.x-0.3),Math.round(tempPos.y-0.5),Math.round(tempPos.z+0.3))).id>0 ||
      World.getBlock(new Vector(Math.round(tempPos.x-0.3),Math.round(tempPos.y-0.5),Math.round(tempPos.z-0.3))).id>0 ||
      World.getBlock(new Vector(Math.round(tempPos.x+0.3),Math.round(tempPos.y-0.5),Math.round(tempPos.z-0.3))).id>0)) 
     this.pos = tempPos;
    if(CanvaManager.getKey(32))
    {
  //  hop=true;
        if(World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y+1.5),Math.round(this.pos.z)) ).id<1
        && World.getBlock( new Vector(Math.round(this.pos.x+0.3),Math.round(this.pos.y+1.5),Math.round(this.pos.z))).id<1
            && World.getBlock( new Vector(Math.round(this.pos.x-0.3),Math.round(this.pos.y+1.5),Math.round(this.pos.z))).id<1
            && World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y+1.5),Math.round(this.pos.z+0.3))).id<1
            && World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y+1.5),Math.round(this.pos.z-0.3))).id<1)
        {
            if(this.inWater)
            {
                hop=true;
                this.jump.yAcc = 0.05;
            }
           else if(this.jump.yAcc<=0&& (World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y-1.5),Math.round(this.pos.z))).id>0 ||
            World.getBlock( new Vector(Math.round(this.pos.x+0.3),Math.round(this.pos.y-1.5),Math.round(this.pos.z))).id>0
            || World.getBlock( new Vector(Math.round(this.pos.x-0.3),Math.round(this.pos.y-1.5),Math.round(this.pos.z))).id>0
            || World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y-1.5),Math.round(this.pos.z+0.3))).id>0
            || World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y-1.5),Math.round(this.pos.z-0.3))).id>0))
            this.jump.yAcc = 0.2;


            
                }
            }
      /*  else if(CanvaManager.getKey(16) && World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y-1.5),Math.round(this.pos.z)) ).id<1)
        this.pos.y-=0.1;
        */    
         if( !hop )
        {
            let subc = World.getSubchunk(this.pos);
           // console.log(subc);
            if(subc!=undefined && subc.generated)
            {
            let block = World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y-1.5),Math.round(this.pos.z))) ;
            if(block.id<1 && World.getBlock( new Vector(Math.round(this.pos.x+0.3),Math.round(this.pos.y-1.5),Math.round(this.pos.z))).id<1
            && World.getBlock( new Vector(Math.round(this.pos.x-0.3),Math.round(this.pos.y-1.5),Math.round(this.pos.z))).id<1
            && World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y-1.5),Math.round(this.pos.z+0.3))).id<1
            && World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y-1.5),Math.round(this.pos.z-0.3))).id<1)
            {
                if(this.inWater)
                this.yAcc+=0.001;
                else
                this.yAcc+=0.015;
            this.pos.y-=this.yAcc;
          
            }
            else if( this.pos.y!= (Math.round(this.pos.y-1.5))+1.5)
            {
            this.pos.y+= (((Math.round(this.pos.y-1.5))+1.5)-this.pos.y)/2;
            this.yAcc=0;
            
            }
            
           
            }
        }
    } catch(error)
    {
console.log(error);
    }
      
        this.camera.setPitch(this.camera.getPitch()- (CanvaManager.mouseMovement.y/10));
        this.camera.setYaw(this.camera.getYaw()+(CanvaManager.mouseMovement.x/10));
        if(this.camera.getPitch()>90) this.camera.setPitch(90);
        if(this.camera.getPitch()<-90) this.camera.setPitch(-90);
        if(CanvaManager.scrollAmount!=0)
        {
            this.selectedItem += CanvaManager.scrollAmount;
            CanvaManager.scrollAmount=0;
            while(this.selectedItem>8)
            {
                this.selectedItem-=9;
            }
            while(this.selectedItem<0)
            {
                this.selectedItem+=9;
            }
        }
        if(CanvaManager.mouse.left) this.mine(); else this.blockBreakingTime=0;
        if(CanvaManager.mouse.right) this.place();
        this.camera.setPosition(new Vector(this.pos.x,this.pos.y+0.7,this.pos.z));
        if(CanvaManager.getKey(49))
        {
            this.switchPerson("First");
        }
       else if(CanvaManager.getKey(50))
        {
            this.switchPerson("Second");
        }
        else if(CanvaManager.getKey(51))
        {
            this.switchPerson("Third");
            console.log(Main.tasks);
        }
    }
    mine()
    {
        let dist = 0.1;
        let  blockPos =this.camera.getPosition().copy();
        let i=0;
        try{
        while(World.getBlock(blockPos).id<1 && i<5)
        {
            i+=dist;
            blockPos = new Vector(blockPos.x+(Math.sin(this.camera.getYaw()*Math.PI/180)*Math.cos(this.camera.getPitch()*Math.PI/180)*dist),blockPos.y+(Math.sin(this.camera.getPitch()*Math.PI/180)*dist),blockPos.z+(Math.cos(this.camera.getYaw()*Math.PI/180)*Math.cos(this.camera.getPitch()*Math.PI/180)*dist) );
        }
        let block=World.getBlock(blockPos);
        if( block.id>0)
        {
        if(this.blockBreakingTime==0)
        {
            this.tbPos=blockPos.copy().round();
        this.targetedBlock = block;
        this.blockBreakingTime=10;
        this.startTime = Date.now()/1000;
        }
        if(this.targetedBlock!=block)
        {
            this.tbPos=blockPos.copy().round();
            this.startTime = Date.now()/1000;
            this.targetedBlock = block;
        }
        if((Date.now()/1000)-blocks[this.targetedBlock.id].breakTime>=this.startTime || Main.fastBreaking)
        {  Main.entities.push(new Item(blockPos,World.getBlock(blockPos).id));
       World.setBlockNoLight(blockPos,0,true);
     
    this.targetedBlock=null;    
    }
        
        }
    }
    catch(error)
    {
        console.log(error);
    }
    }
    place()
    {

        let  blockPos =new Vector(this.pos.x,this.pos.y+0.7,this.pos.z);
        let i=0;
        let dist = 0.1;
        try{
            let lastPos =new Vector(0,0,0);
        while( World.getBlock(blockPos).id<1 && i<5)
        {
        //    console.log(Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos));
          //  console.log(blockPos);
            lastPos=blockPos.copy();
            i+=dist;
            blockPos = new Vector(blockPos.x+(Math.sin(this.camera.getYaw()*Math.PI/180)*Math.cos(this.camera.getPitch()*Math.PI/180)*dist),blockPos.y+(Math.sin(this.camera.getPitch()*Math.PI/180)*dist),blockPos.z+(Math.cos(this.camera.getYaw()*Math.PI/180)*Math.cos(this.camera.getPitch()*Math.PI/180)*dist) );
        }
       if(  World.getBlock(lastPos).id<1 && i<5 &&  !lastPos.round().equals(new Vector(this.pos.x,this.pos.y-0.5,this.pos.z).round()) &&  !lastPos.round().equals(this.pos.round()) && this.itemsBar[this.selectedItem].id!=0 )
       {
       World.setBlockNoLight(lastPos,this.itemsBar[this.selectedItem].id,true);
       this.itemsBar[this.selectedItem].count--;
       if(this.itemsBar[this.selectedItem].count==0)
       this.itemsBar[this.selectedItem].id=0;
        CanvaManager.mouse.right=false;
        console.log("placed block!! at: ",lastPos);
       }
        }
    catch(error)
    {
        console.log(error);
    }
        
    }
   /* placeBlock()//Breesenham
    {
        let secondPos =  this.pos.copy();
        secondPos.y = secondPos.y+1;
        let firstPos = new Vector(secondPos.x+(Math.sin(this.camera.getYaw()*Math.PI/180)*Math.cos(this.camera.getPitch()*Math.PI/180)*5),secondPos.y+(Math.sin(this.camera.getPitch()*Math.PI/180)*5),secondPos.z+(5*Math.cos(this.camera.getYaw()*Math.PI/180)*Math.cos(this.camera.getPitch()*Math.PI/180)));
        let temp = secondPos;
        secondPos =firstPos;
        firstPos = temp ;
        let ndVec = new Vector(firstPos.x-secondPos.x,firstPos.y-secondPos.y,firstPos.z-secondPos.z);
        let dVec = new Vector(Math.abs(ndVec.x),Math.abs(ndVec.y),Math.abs(ndVec.z));
        if(dVec.x>dVec.y && dVec.x>dVec.z)
        {
            //driving x axis
            let py = (2*dVec.y) - dVec.x;
            let pz = (2*dVec.z) - dVec.x;
            let i=dVec.x-1;
            let dod =new Vector(1,1,1) ;
            while(i>0)
            {
            i--;
            if(firstPos.x<secondPos.x)
            dod.x=1;
            else
            dod.x=-1;
            if(firstPos.y<secondPos.y)
            dod.y=1;
            else
            dod.y=-1;
            if(firstPos.z<secondPos.z)
            dod.z=1;
            else
            dod.z=-1;
            let lastPos= firstPos;
            if(py<0 && pz<0)
            {
                firstPos = new Vector(firstPos.x+dod.x,firstPos.y,firstPos.z);
                if(World.getBlock(firstPos).id!=0)
                {
               World.setBlock(lastPos,this.itemsBar[this.selectedItem] )
               CanvaManager.mouse.right=false; 
               return;
                 }
                py = py+ (2*dVec.y) ;
                pz = pz+ (2*dVec.z) ;
            }
            else if(py>0 && pz<0 )
            {
                firstPos = new Vector(firstPos.x,firstPos.y+dod.y,firstPos.z);
                if(World.getBlock(firstPos).id!=0)
                {
               World.setBlock(lastPos,this.itemsBar[this.selectedItem] )
               CanvaManager.mouse.right=false; 
               return;
                 }
                py = py+  ((2*dVec.y)-(2*dVec.x)) ;
               pz = pz+ (2*dVec.z) ;
            }
            else if(py ==0 )
            {
                firstPos = new Vector(firstPos.x+dod.x,firstPos.y,firstPos.z+dod.z);
                if(World.getBlock(firstPos).id!=0)
                {
               World.setBlock(lastPos,this.itemsBar[this.selectedItem] )
               CanvaManager.mouse.right=false; 
               return;
                 }
                 py = py+  (2*dVec.y) ;
                 pz = pz+ ((2*dVec.z)-(2*dVec.x)); 
            }
            else
            {   
                firstPos = new Vector(firstPos.x+dod.x,firstPos.y,firstPos.z+dod.z);
                if(World.getBlock(firstPos).id!=0)
                {
               World.setBlock(lastPos,this.itemsBar[this.selectedItem] )
               CanvaManager.mouse.right=false; 
               return;
                 }
                py = py+  ((2*dVec.y)-(2*dVec.x)) ;
                pz = pz+ ((2*dVec.z)); 
            }
        }
        }
        else if(dVec.y>dVec.x && dVec.y>dVec.z)
        {
            //driving y axis
            let px = (2*dVec.x) - dVec.y;
            let pz = (2*dVec.z) - dVec.y;
            let i=dVec.y-1;
            let dod =new Vector(1,1,1) ;
           
            while(i>0)
            {
            i--;
            let lastPos= firstPos;
            if(firstPos.x<secondPos.x)
            dod.x=1;
            else
            dod.x=-1;
            if(firstPos.y<secondPos.y)
            dod.y=1;
            else
            dod.y=-1;
            if(firstPos.z<secondPos.z)
            dod.z=1;
            else
            dod.z=-1;
            if(px<0 && pz<0)
            {
                firstPos = new Vector(firstPos.x,firstPos.y+dod.y,firstPos.z);
                if(World.getBlock(firstPos).id!=0)
                {
               World.setBlock(lastPos,this.itemsBar[this.selectedItem] )
               CanvaManager.mouse.right=false; 
               return;
                 }
                px = px+ (2*dVec.x) ;
                pz = pz+ (2*dVec.z) ;
            }
            else if(px>0 && pz<0 )
            {
                firstPos = new Vector(firstPos.x+dod.x,firstPos.y+dod.y,firstPos.z);
                if(World.getBlock(firstPos).id!=0)
                {
               World.setBlock(lastPos,this.itemsBar[this.selectedItem] )
               CanvaManager.mouse.right=false; 
               return;
                 }
                px = px+  ((2*dVec.x)-(2*dVec.y)) ;
                pz = pz+ (2*dVec.z) ;
            }
            else if(px == 0 )
            {
                firstPos = new Vector(firstPos.x,firstPos.y+dod.y,firstPos.z+dod.z);
                if(World.getBlock(firstPos).id!=0)
                {
               World.setBlock(lastPos,this.itemsBar[this.selectedItem] )
               CanvaManager.mouse.right=false; 
               return;
                 }
                 px = px+  (2*dVec.x) ;
                 pz = pz+ ((2*dVec.z)-(2*dVec.y)); 
            }
            else
            {
                firstPos = new Vector(firstPos.x+dod.x,firstPos.y+dod.y,firstPos.z+dod.z);
                if(World.getBlock(firstPos).id!=0)
                {
               World.setBlock(lastPos,this.itemsBar[this.selectedItem] )
               CanvaManager.mouse.right=false; 
               return;
                 }
                px = px+  ((2*dVec.x)-(2*dVec.y)) ;
                pz = pz+ ((2*dVec.z)-(2*dVec.y)); 
            }
        }
        }
       else if(dVec.z>dVec.x && dVec.z>dVec.y)
        {
            //driving z axis
            let px = (2*dVec.x) - dVec.z;
            let py = (2*dVec.y) - dVec.z;
            let i=dVec.z-1;
            let dod =new Vector(1,1,1) ;
           
            while(i>0)
            {
            i--;
            if(firstPos.x<secondPos.x)
            dod.x=1;
            else
            dod.x=-1;
            if(firstPos.y<secondPos.y)
            dod.y=1;
            else
            dod.y=-1;
            if(firstPos.z<secondPos.z)
            dod.z=1;
            else
            dod.z=-1;
            let lastPos = firstPos;
            if(px<0 && py<0)
            {
                firstPos = new Vector(firstPos.x,firstPos.y,firstPos.z+dod.z);
                if(World.getBlock(firstPos).id!=0)
                {
               World.setBlock(lastPos,this.itemsBar[this.selectedItem] )
               CanvaManager.mouse.right=false; 
               return;
                 }
                px = px+ (2*dVec.x) ;
                py = py+ (2*dVec.y) ;
            }
            else if(px>0 && py<0 )
            {
                firstPos = new Vector(firstPos.x+dod.x,firstPos.y+dod.y,firstPos.z);
                if(World.getBlock(firstPos).id!=0)
                {
               World.setBlock(lastPos,this.itemsBar[this.selectedItem] )
               CanvaManager.mouse.right=false; 
               return;
                 }
                px = px+  ((2*dVec.x)-(2*dVec.z)) ;
                py = py+ (2*dVec.y) ;
            }
            else if(px == 0 )
            {
                firstPos = new Vector(firstPos.x,firstPos.y+dod.y,firstPos.z+dod.z);
                if(World.getBlock(firstPos).id!=0)
                {
               World.setBlock(lastPos,this.itemsBar[this.selectedItem] )
               CanvaManager.mouse.right=false; 
               return;
                 }
                 px = px+  (2*dVec.x) ;
                 py = py+ ((2*dVec.y)-(2*dVec.z)); 
            }
            else
            {
                firstPos = new Vector(firstPos.x+dod.x,firstPos.y+dod.y,firstPos.z+dod.z);
                if(World.getBlock(firstPos).id!=0)
                {
               World.setBlock(lastPos,this.itemsBar[this.selectedItem] )
               CanvaManager.mouse.right=false; 
               return;
                 }
                px = px+  ((2*dVec.x)-(2*dVec.z)) ;
                py = py+ ((2*dVec.y)-(2*dVec.z)); 
            }
        }
        }
    }
    placeBlock2()//Kocer method
    {
        let firstPos =  this.pos.copy();
        firstPos.y = firstPos.y+1;
        let secondPos = new Vector(firstPos.x+(Math.sin(this.camera.getYaw()*Math.PI/180)*Math.cos(this.camera.getPitch()*Math.PI/180)*5),firstPos.y+(Math.sin(this.camera.getPitch()*Math.PI/180)*5),firstPos.z+(5*Math.cos(this.camera.getYaw()*Math.PI/180)*Math.cos(this.camera.getPitch()*Math.PI/180)));
        secondPos= new Vector(Math.round(secondPos.x),Math.round(secondPos.y),Math.round(secondPos.z) )
        let i=0;
        let dod =new Vector(1,1,1);
        while(i<5)
        {
            i++;
            let ndVec = new Vector(firstPos.x-secondPos.x,firstPos.y-secondPos.y,firstPos.z-secondPos.z);
            let dVec = new Vector(Math.abs(ndVec.x),Math.abs(ndVec.y),Math.abs(ndVec.z));
            if(firstPos.x<secondPos.x)
            dod.x=1;
            else
            dod.x=-1;
            if(firstPos.y<secondPos.y)
            dod.y=1;
            else
            dod.y=-1;
            if(firstPos.z<secondPos.z)
            dod.z=1;
            else
            dod.z=-1;
            let lastPos = firstPos.copy();
            if(dVec.x>=dVec.y && dVec.x>=dVec.z)
            {
            firstPos.x+=dod.x;
            }
            else if(dVec.y>=dVec.x && dVec.y>=dVec.z)
            {
                firstPos.y+=dod.y;
            }
            else if(dVec.z>=dVec.x && dVec.z>=dVec.y)
            {
                firstPos.z+=dod.z;
            }
            if(World.getBlock(firstPos).id!=0)
            {
           World.setBlock(lastPos,this.itemsBar[this.selectedItem] )
           CanvaManager.mouse.right=false; 
           return;
             }
        }
  
    }*/
    isTouching(vec:Vector)
    {
        if(vec.x > this.pos.x-0.3 && vec.z > this.pos.z-0.3 && vec.y > this.pos.y-1 
            && vec.x < this.pos.x+0.3 && vec.z < this.pos.z+0.3 && vec.y < this.pos.y+1 )
        return true;
      return false;
        
    }
   pickupItem(id)
   {
       for(let x=0;x<this.itemsBar.length;x++)
       {
           if(this.itemsBar[x].id==id && this.itemsBar[x].count<65)
           {
           this.itemsBar[x].count++;
        return   
        }
       if(this.itemsBar[x].id ==0 ) 
       {this.itemsBar[x].id = id;
     return;
       }   
        }
        for(let x=0;x<this.inventory.length;x++)
        {
            if(this.inventory[x].id==id && this.inventory[x].count<65)
            {
            this.inventory[x].count++;
         return   
         }
        if(this.inventory[x].id ==0 ) 
        {this.inventory[x].id = id;
      return;
        }   
         }
   } 
    render()
    {
     
       
        if(this.person != "First") 
        {
            let transformation = Matrix.identity();
        transformation =transformation.translate(this.pos.x,this.camera.getPosition().y,this.pos.z);
        transformation = transformation.rotateY(-this.camera.getYaw());
        transformation = transformation.rotateX(-this.camera.getPitch());
        transformation = transformation.scale(0.4,0.4,0.4);
       Texture.skinAtlas.bind();
        this.vao.bind();
       
        Main.atlasShader.use();
        Main.atlasShader.loadUniforms(this.camera.getProjection(),transformation,this.camera.getView(),15);
        gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_INT,0);
        Main.atlasShader.loadTransformation( Matrix.identity().translate(this.pos.x,this.pos.y+0.15,this.pos.z).scale(0.55,0.55,0.55).rotateY(-this.camera.getYaw()))
        gl.drawElements(gl.TRIANGLES,12,gl.UNSIGNED_INT,36*4);
        Main.shader.use();
        }
        if(this.blockBreakingTime>1)
        {      let   transformation = Matrix.identity();
        this.blockOverlay.vao.bind()
        gl.bindTexture(gl.TEXTURE_2D_ARRAY ,Texture.blockOverlay);
        Main.shader.loadUniforms(this.camera.getProjection(),transformation,this.camera.getView(),15);
      gl.drawElements(gl.TRIANGLES,this.blockOverlay.count,gl.UNSIGNED_INT,0);
        }
    }
}
