import { Camera } from "../Engine/Camera.js";
import { CanvaManager } from "../Engine/CanvaManager.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { Main } from "../Main.js";

export class Player
{
    camera:Camera = new Camera();
    pos:Vector;
    constructor(pos:Vector)
    {
        this.pos = pos;
        this.camera.setPosition(new Vector(pos.x,pos.y+1,pos.z));
        
    }
    updatePos()
    {
        if(CanvaManager.getKey(87))
        {
            this.pos.x+=Math.sin(this.camera.getYaw()*Math.PI/180)*0.1;
            this.pos.z+=Math.cos(this.camera.getYaw()*Math.PI/180)*0.1;
        }
        else if(CanvaManager.getKey(83))
        {
            this.pos.x-=Math.sin(this.camera.getYaw()*Math.PI/180)*0.1;
            this.pos.z-=Math.cos(this.camera.getYaw()*Math.PI/180)*0.1;
        }
        if(CanvaManager.getKey(68))
        {
            this.pos.x+=Math.sin((this.camera.getYaw()+90)*Math.PI/180)*0.1;
            this.pos.z+=Math.cos((this.camera.getYaw()+90)*Math.PI/180)*0.1;
        }
        else if(CanvaManager.getKey(65))
        {
            this.pos.x-=Math.sin((this.camera.getYaw()+90)*Math.PI/180)*0.1;
            this.pos.z-=Math.cos((this.camera.getYaw()+90)*Math.PI/180)*0.1;
        }
        if(CanvaManager.getKey(32))
        this.pos.y+=0.1;
        else if(CanvaManager.getKey(16))
        this.pos.y-=0.1;
        this.camera.setPitch(this.camera.getPitch()- (CanvaManager.mouseMovement.y/10));
        this.camera.setYaw(this.camera.getYaw()+(CanvaManager.mouseMovement.x/10));
        if(this.camera.getPitch()>90) this.camera.setPitch(90);
        if(this.camera.getPitch()<-90) this.camera.setPitch(-90);
        this.camera.setPosition(new Vector(this.pos.x,this.pos.y+1,this.pos.z));
        this.mine(new Vector(this.pos.x,this.pos.y+1,this.pos.z));
    }
    mine(pos:Vector)
    {
        if(pos.x>0&&pos.x<250 && pos.y>0 &&pos.y<250 && pos.z>0 &&pos.z<250 )
        {
        let inChunkPos = new Vector(Math.round(pos.x%16),Math.round(pos.y),Math.round(pos.z%16));
        let chunkPos =new Vector(Math.round(pos.x/16),Math.round(pos.y),Math.round(pos.z/16));
        if( Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos)!=0)
        {
        Main.chunks[chunkPos.x][chunkPos.z].setBlock(inChunkPos,0);
        console.log("mined block!!");
        }
        }
    }
}