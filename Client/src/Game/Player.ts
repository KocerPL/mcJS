import { Camera } from "../Engine/Camera.js";
import { CanvaManager } from "../Engine/CanvaManager.js";
import { RenderSet } from "../Engine/RenderSet.js";
import { Texture } from "../Engine/Texture.js";
import { clamp, randRange } from "../Engine/Utils/Math.js";
import { Matrix4 } from "../Engine/Utils/Matrix4.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { Main } from "../Main.js";
import { Block } from "./Block.js";
import { Item } from "./entities/Item.js";
import { PlayerEntity } from "./entities/PlayerEntity.js";
import { ItemBar } from "./gui/ItemBar.js";
import { ItemHolder } from "./gui/ItemHolder.js";
import { GameScene } from "./scenes/GameScene.js";
import { World } from "./World.js";
const gl = CanvaManager.gl;
export type pers = "First" | "Second" |"Third";
export class invItem 
{
    id:number;
    count:number;
    nn:null;
    constructor(id)
    {
        this.id=id;
        this.count=0;
    }
}
export class Player
{
//model
    id:number;
    entity:PlayerEntity;
    camera:Camera = new Camera();
    pos:Vector;
    itemsBar:Array<invItem>=new Array(9);
    inventory:Array<invItem>=new Array(27);
    locked=false;
    targetedBlock=null;
    startTime=0;
    tbPos = new Vector(0,0,0);
    blockOverlay:RenderSet;
    blockBreakingTime=0;
    selectedItem = 0;
    person:pers ="First"; 
    yAcc =0.01;
    legChange= 6;
    mainAcc=0.1;
    lastTime=0;
    lastScroll=0;
    gs:GameScene;
    openInventory =false;
    static blVertices =[
    //przód
        -0.501,-0.501,-0.501,
        0.501,-0.501,-0.501,
        0.501,0.501,-0.501,
        -0.501,0.501,-0.501,
        //tył
        -0.501,-0.501,0.501,
        0.501,-0.501,0.501,
        0.501,0.501,0.501,
        -0.501,0.501,0.501,
        //lewo
        -0.501,-0.501,-0.501,
        -0.501,-0.501,0.501,
        -0.501,0.501 ,0.501,
        -0.501,0.501,-0.501,
        //prawo
        0.501,-0.501,-0.501,
        0.501,-0.501,0.501,
        0.501,0.501 ,0.501,
        0.501,0.501,-0.501,
        //dół
        -0.501,-0.501,-0.501,
        -0.501,-0.501,0.501,
        0.501,-0.501 ,0.501,
        0.501,-0.501,-0.501,
        //góra
        -0.501,0.501,-0.501,
        -0.501,0.501,0.501,
        0.501,0.501 ,0.501,
        0.501,0.501,-0.501

    ];
    rotX=0;
    rotY=0;
    jump ={
        time:0,
        yAcc:0,

    };
    constructor(pos:Vector,gs:GameScene)
    {
        this.gs = gs;
        this.blockOverlay = new RenderSet(Main.atlasShader);
        this.pos = pos;
        this.entity = new PlayerEntity(this.pos,gs);
        this.camera.setPosition(new Vector(pos.x,pos.y+1,pos.z));
        for(let i=0;i<9;i++)
            this.itemsBar[i]= new invItem(0);
        for(let i=0;i<27;i++)
            this.inventory[i]= new invItem(0);
        // this.updateItem(2,0,64);
    }
    update()
    {
        if(0!=CanvaManager.scrollAmount)
        {
            if(Math.abs(CanvaManager.scrollAmount)>0.1) 
            {
                const ib =   this.gs.gui.get("ItemBar");
            
                if(ib instanceof ItemBar)
                {
                    if(CanvaManager.scrollAmount> 0)
                        ib.currentSlot ++;
                    else
                        ib.currentSlot--;
                    ib.currentSlot = clamp(ib.currentSlot,0,8);
                    this.selectedItem = ib.currentSlot;
                    ib.updateSlot();
                    CanvaManager.scrollAmount=0;
                }
            }
        }
        if(this.targetedBlock instanceof Block)
        {
            let vertices =[];
            vertices= vertices.concat(Player.blVertices);
            for(let i=0;i<vertices.length;i+=3)
            {
                vertices[i] =vertices[i]+this.tbPos.x;
                vertices[i+1] =vertices[i+1]+this.tbPos.y;
                vertices[i+2] =vertices[i+2]+this.tbPos.z;
            }
            const index = 5-Math.round((((Date.now()/1000)-this.startTime)/Block.info[this.targetedBlock.id].breakTime)*5); 
            if(index>-1)
            {
                let indices = [];
                let light=[];
                let textureCoords = [];
                for(let i=0;i<6;i++)
                {
                    const coords = Texture.blockOverlay.coords;
                    textureCoords= textureCoords.concat([coords[index].x, coords[index].y,
                        coords[index].dx, coords[index].y, 
                        coords[index].dx, coords[index].dy,
                        coords[index].x, coords[index].dy]);
                    light=    light.concat([14,14,14,14]);
                    const k = 4*i;
                    indices= indices.concat([2+k,1+k,k,2+k,0+k,3+k]);
                }
                this.blockOverlay.blockLight=light;
                this.blockOverlay.textureCoords=textureCoords;
                this.blockOverlay.skyLight=light;
                this.blockOverlay.vertices=vertices;
                this.blockOverlay.indices=indices;
                this.blockOverlay.bufferArrays();
            }
        }
        else
            this.blockOverlay.count=0;
        this.updatePos();
    }
    dropItem(id:number,count:number)
    {
       
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
    isInBlock(pos:Vector):boolean
    {
        if(World.getBlock(new Vector(pos.x+0.33,pos.y-1,pos.z+0.33),this.gs).id>0)
            return true;
        if(World.getBlock(new Vector(pos.x-0.33,pos.y-1,pos.z+0.33),this.gs).id>0)
            return true;
        if(World.getBlock(new Vector(pos.x-0.33,pos.y-1,pos.z-0.33),this.gs).id>0)
            return true;
        if(World.getBlock(new Vector(pos.x+0.33,pos.y-1,pos.z-0.33),this.gs).id>0)
            return true;

        if(World.getBlock(new Vector(pos.x+0.33,pos.y-0.1,pos.z+0.33),this.gs).id>0)
            return true;
        if(World.getBlock(new Vector(pos.x-0.33,pos.y-0.1,pos.z+0.33),this.gs).id>0)
            return true;
        if(World.getBlock(new Vector(pos.x-0.33,pos.y-0.1,pos.z-0.33),this.gs).id>0)
            return true;
        if(World.getBlock(new Vector(pos.x+0.33,pos.y-0.1,pos.z-0.33),this.gs).id>0)
            return true;

        if(World.getBlock(new Vector(pos.x+0.33,pos.y+0.75,pos.z+0.33),this.gs).id >0)
            return true;
        if(World.getBlock(new Vector(pos.x-0.33,pos.y+0.75,pos.z+0.33),this.gs).id>0)
            return true;
        if(World.getBlock(new Vector(pos.x-0.33,pos.y+0.75,pos.z-0.33),this.gs).id>0)
            return true;
        if(World.getBlock(new Vector(pos.x+0.33,pos.y+0.75,pos.z-0.33),this.gs).id>0)
            return true;
        return false;
    }
    norm(n:number):number
    {
        if(n>0)
            return 1;
        if(n<0)
            return -1;
        return 0;
    }
    isBlockInWay(pos:Vector):boolean
    {
        const delta =  Vector.add(pos,this.pos.mult(-1));
        if(this.isInBlock(Vector.add(new Vector(delta.x,delta.y,delta.z),this.pos)))
            return true;
        if(Math.abs(delta.x)>=Math.abs(delta.y) && Math.abs(delta.x)>=Math.abs(delta.z))
        {
            if(this.norm(delta.x)!=0)
                for(let x =0;Math.abs(x)<Math.abs(delta.x);x+=(this.norm(delta.x)*0.66))
                {
                    const percent = x/delta.x;
                    if(this.isInBlock(Vector.add(new Vector(x,delta.y*percent,delta.z*percent),this.pos)))
                        return true;
                }
        }
        else if(Math.abs(delta.y)>  Math.abs(delta.x) && Math.abs(delta.y)>Math.abs(delta.z))
        {
            if(this.norm(delta.y)!=0)
                for(let y =0;Math.abs(y)<Math.abs(delta.y);y+=(this.norm(delta.y)*0.66))
                {
                    const percent = y/delta.y;
                    if(this.isInBlock(Vector.add(new Vector(delta.x*percent,y,delta.z*percent),this.pos)))
                        return true;
                }
        }
        else if(Math.abs(delta.z)>  Math.abs(delta.y) && Math.abs(delta.z)>Math.abs(delta.x))
        {
            if(this.norm(delta.z)!=0)
                for(let z =0;Math.abs(z)<Math.abs(delta.z);z+=(this.norm(delta.z)*0.66))
                {
                    const percent = z/delta.z;
                    if(this.isInBlock(Vector.add(new Vector(delta.x*percent,delta.y*percent,z),this.pos)))
                        return true;
                }
        }
        return false;
    }
    updatePos()
    {

        this.entity.rotation.y = -this.camera.getYaw();
        this.entity.rotation.x = -this.camera.getPitch();
        this.entity.pos = this.pos;
        const nowTime = Date.now();
        if(this.lastTime<nowTime-100)
        {
            this.gs.socket.emit("playerMove",this.entity.pos,this.entity.rotation);
            this.lastTime = nowTime;
        }
        //if(this.locked) return;
        let hop =false;
        const tempPos = this.pos.copy();
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
            if(!this.locked && !this.openInventory)
            {
                let yRot = -this.entity.bodyRot;
                if(CanvaManager.getKeyOnce("Q"))
                {
                   
                    this.dropItem(this.itemsBar[this.selectedItem].id,1);
                    this.updateItem(this.itemsBar[this.selectedItem].id,this.selectedItem,this.itemsBar[this.selectedItem].count-1);
                   
                }
                if(CanvaManager.getKey("CAPSLOCK"))
                    speed=2;
                if(CanvaManager.getKey("W"))
                {
                    this.entity.bodyRot = this.entity.rotation.y;
                    yRot = -this.entity.bodyRot;
                    tempPos.x+=Math.sin(yRot*Math.PI/180)*0.1*speed;
                    tempPos.z +=Math.cos(yRot*Math.PI/180)*0.1*speed;
              
                }
                else if(CanvaManager.getKey("S"))
                {
                    this.entity.bodyRot = this.entity.rotation.y;
                    yRot = -this.entity.bodyRot;
                    tempPos.x-=Math.sin(yRot*Math.PI/180)*0.1;
                    tempPos.z-=Math.cos(yRot*Math.PI/180)*0.1;
                }
                if(CanvaManager.getKey("D"))
                {
                    tempPos.x+=Math.sin((yRot+90)*Math.PI/180)*0.1;
                    tempPos.z+=Math.cos((yRot+90)*Math.PI/180)*0.1;
                }
                else if(CanvaManager.getKey("A"))
                {
           

                    tempPos.x-=Math.sin((yRot+90)*Math.PI/180)*0.1;
                    tempPos.z-=Math.cos((yRot+90)*Math.PI/180)*0.1;
            
                }
            }   
            if(World.getBlock(new Vector(tempPos.x,tempPos.y-1,tempPos.z),this.gs).id<=0 && !this.gs.fly)
            {
                this.yAcc+=0.01;
                tempPos.y-=this.yAcc;
            }   
            if(this.gs.fly && CanvaManager.getKey("Z"))
                tempPos.y-=0.3;
            if(!this.isBlockInWay(tempPos)) 
                this.pos = tempPos;
            else  if(!this.isBlockInWay(new Vector(tempPos.x,this.pos.y,tempPos.z)))
            {
                this.pos = new Vector(tempPos.x,this.pos.y,tempPos.z);
                this.yAcc=0;
            }
            else  if(!this.isBlockInWay(new Vector(tempPos.x,tempPos.y,this.pos.z)))
            {
                this.pos = new Vector(tempPos.x,tempPos.y,this.pos.z);
             
            }
            else  if(!this.isBlockInWay(new Vector(this.pos.x,tempPos.y,tempPos.z)))
            {
                this.pos = new Vector(this.pos.x,tempPos.y,tempPos.z);
            }
            else  if(!this.isBlockInWay(new Vector(this.pos.x,this.pos.y,tempPos.z)))
            {
                this.yAcc=0;
                this.pos = new Vector(this.pos.x,this.pos.y,tempPos.z);
                this.yAcc=0;
            }
            else  if(!this.isBlockInWay(new Vector(this.pos.x,tempPos.y,this.pos.z)))
            {
                this.pos = new Vector(this.pos.x,tempPos.y,this.pos.z);
             
            }
            else  if(!this.isBlockInWay(new Vector(tempPos.x,this.pos.y,this.pos.z)))
            {
                this.yAcc=0;
                this.pos = new Vector(tempPos.x,this.pos.y,this.pos.z);
            }
               
            if(CanvaManager.getKey(" "))
            {
                //  hop=true;
                if(this.gs.fly)
                    this.jump.yAcc = 0.2;
                else if(World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y+1.5),Math.round(this.pos.z)),this.gs ).id<1
        && World.getBlock( new Vector(Math.round(this.pos.x+0.3),Math.round(this.pos.y+1.5),Math.round(this.pos.z)),this.gs).id<1
            && World.getBlock( new Vector(Math.round(this.pos.x-0.3),Math.round(this.pos.y+1.5),Math.round(this.pos.z)),this.gs).id<1
            && World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y+1.5),Math.round(this.pos.z+0.3)),this.gs).id<1
            && World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y+1.5),Math.round(this.pos.z-0.3)),this.gs).id<1)
                {
                    if(this.jump.yAcc<=0&& (World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y-1.5),Math.round(this.pos.z)),this.gs).id>0 ||
            World.getBlock( new Vector(Math.round(this.pos.x+0.3),Math.round(this.pos.y-1.5),Math.round(this.pos.z)),this.gs).id>0
            || World.getBlock( new Vector(Math.round(this.pos.x-0.3),Math.round(this.pos.y-1.5),Math.round(this.pos.z)),this.gs).id>0
            || World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y-1.5),Math.round(this.pos.z+0.3)),this.gs).id>0
            || World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y-1.5),Math.round(this.pos.z-0.3)),this.gs).id>0))
                        this.jump.yAcc = 0.2;


            
                }
            }
           
            /*  else if(CanvaManager.getKey(16) && World.getBlock( new Vector(Math.round(this.pos.x),Math.round(this.pos.y-1.5),Math.round(this.pos.z)) ).id<1)
        this.pos.y-=0.1;
        */    
           
        } catch(error)
        {
        // console.log("Update pos error",error);
        }
        if(Math.abs(this.entity.rotation.z)>45)
            this.legChange= -this.legChange;
        this.camera.setPosition(new Vector(this.pos.x,this.pos.y+0.7,this.pos.z));
        if(this.locked || this.openInventory) return;
        if(CanvaManager.getKey("W")||CanvaManager.getKey("A")||CanvaManager.getKey("S")||CanvaManager.getKey("D"))
            this.entity.rotation.z += this.legChange*speed;
        else 
            this.entity.rotation.z = 0;       
        this.camera.setPitch(this.camera.getPitch()- (CanvaManager.mouseMovement.y/10));
        this.camera.setYaw(this.camera.getYaw()+(CanvaManager.mouseMovement.x/10));
        if(this.camera.getPitch()>90) this.camera.setPitch(90);
        if(this.camera.getPitch()<-90) this.camera.setPitch(-90);
        if(CanvaManager.mouse.left) this.mine(); else this.blockBreakingTime=0;
        if(CanvaManager.mouse.right) this.place();
       
        if(CanvaManager.getKey("1"))
        {
            this.switchPerson("First");
        }
        else if(CanvaManager.getKey("2"))
        {
            this.switchPerson("Second");
        }
        else if(CanvaManager.getKey("3"))
        {
            this.switchPerson("Third");
        }
    }
    mine()
    {
        const dist = 0.1;
        let  blockPos =this.camera.getPosition().copy();
        let i=0;
        try{
            while(World.getBlock(blockPos,this.gs).id<1 && i<5)
            {
                i+=dist;
                blockPos = new Vector(blockPos.x+(Math.sin(this.camera.getYaw()*Math.PI/180)*Math.cos(this.camera.getPitch()*Math.PI/180)*dist),blockPos.y+(Math.sin(this.camera.getPitch()*Math.PI/180)*dist),blockPos.z+(Math.cos(this.camera.getYaw()*Math.PI/180)*Math.cos(this.camera.getPitch()*Math.PI/180)*dist) );
            }
            const block=World.getBlock(blockPos,this.gs);
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
                if((Date.now()/1000)-Block.info[this.targetedBlock.id].breakTime>=this.startTime || this.gs.fastBreaking)
                { const middle = Vector.add(blockPos.round(),new Vector(randRange(-0.2,0.2),randRange(-0.2,0.2),randRange(-0.2,0.2)));
                    //this.gs.entities.push(new Item(middle,World.getBlock(blockPos,this.gs).id,this.gs));
                    this.gs.socket.emit("placeBlock",{id:0,pos:{x:blockPos.x,y:blockPos.y,z:blockPos.z},slot:this.selectedItem});
                    World.breakBlock(blockPos,this.gs);
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
        const dist = 0.1;
        try{
            let lastPos =new Vector(0,0,0);
            while( World.getBlock(blockPos,this.gs).id<1 && i<5)
            {
                //    console.log(Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos));
                //  console.log(blockPos);
                lastPos=blockPos.copy();
                i+=dist;
                blockPos = new Vector(blockPos.x+(Math.sin(this.camera.getYaw()*Math.PI/180)*Math.cos(this.camera.getPitch()*Math.PI/180)*dist),blockPos.y+(Math.sin(this.camera.getPitch()*Math.PI/180)*dist),blockPos.z+(Math.cos(this.camera.getYaw()*Math.PI/180)*Math.cos(this.camera.getPitch()*Math.PI/180)*dist) );
            }
            if(  World.getBlock(lastPos,this.gs).id<1 && i<5 &&  !lastPos.round().equals(new Vector(this.pos.x,this.pos.y-0.5,this.pos.z).round()) &&  !lastPos.round().equals(this.pos.round()) && this.itemsBar[this.selectedItem].id!=0 )
            {
                this.gs.socket.emit("placeBlock",{id:this.itemsBar[this.selectedItem].id,pos:{x:lastPos.x,y:lastPos.y,z:lastPos.z},slot:this.selectedItem});  
                World.placeBlock(lastPos,this.itemsBar[this.selectedItem].id,this.gs);
                //this.updateItem(this.itemsBar[this.selectedItem].id,this.selectedItem,this.itemsBar[this.selectedItem].count-1);
                CanvaManager.mouse.right=false;
              
            }
        }
        catch(error)
        {
            console.log(error);
        }
        
    }
    isTouching(vec:Vector,offset?:number)
    {
        offset??=0;
        if(vec.x > this.pos.x-0.3-offset && vec.z > this.pos.z-0.3-offset && vec.y > this.pos.y-1 
            && vec.x < this.pos.x+0.3+offset && vec.z < this.pos.z+0.3+offset && vec.y < this.pos.y+1 )
            return true;
        return false;
        
    }
    pickupItem(item:Item)
    {
        const id= item.type;
        for(let x=0;x<this.itemsBar.length;x++)
        {
            if(this.itemsBar[x].id==id && this.itemsBar[x].count<64)
            {
                this.updateItem(id,x,this.itemsBar[x].count+1);
                return;
            }
            if(this.itemsBar[x].id ==0 ) 
            {
                this.updateItem(id,x,item.count);
                return;
            }   
        }
        for(let x=0;x<this.inventory.length;x++)
        {
            if(this.inventory[x].id==id && this.inventory[x].count<64)
            {
                this.inventory[x].count+=item.count;
                return;
            }
            if(this.inventory[x].id ==0 ) 
            {this.inventory[x].id = id;
                this.inventory[x].count=item.count;
                return;
            }   
        }
    } 
    updateItem(id:number,slot:number,count:number)
    {
        if(count<1)
        {
            id=0;
        }
        this.itemsBar[slot].id =id;
        this.itemsBar[slot].count=count;
        const hold =  this.gs.gui.get("slot_"+(slot+1)+"_holder");
        if(hold instanceof ItemHolder)
            hold.change(id,count);
    }
    updateInvItem(id:number,slot:number,count:number)
    {
        if(count<1)
        {
            id=0;
        }
        this.inventory[slot].id =id;
        this.inventory[slot].count=count;
        const hold =  this.gs.gui.get("invSlot_"+(slot+1)+"_holder");
        if(hold instanceof ItemHolder)
            hold.change(id,count);
    }
    render()
    {   
        
        if(this.person != "First") 
        {
          
            this.entity.render();
        }
        else
            this.entity.renderHandItem();
        if(this.blockBreakingTime>1)
        {      const   transformation = Matrix4.identity();
            this.blockOverlay.vao.bind();
            Main.shader.use();
            Texture.blockOverlay.bind();
            Main.shader.loadUniforms(this.camera.getProjection(),transformation,this.camera.getView(),15);
            gl.drawElements(gl.TRIANGLES,this.blockOverlay.count,gl.UNSIGNED_INT,0);
        }
    }
}
