import { CanvaManager } from "./CanvaManager.js";
import { Matrix } from "./Utils/Matrix.js";
import { Vector } from "./Utils/Vector.js";

export class Camera
{
   private projection:Matrix=Matrix.projection(70,1,100,CanvaManager.getHeight/CanvaManager.getWidth);;
   private pos:Vector = new Vector(0,0,0);
   private view:Matrix=Matrix.viewFPS(this.pos,0,0);
   private yaw = 0;
   private pitch =0;
   private fov =70;
   private near = 1;
   private far =100;
   private aspect =CanvaManager.getHeight/CanvaManager.getWidth;

    constructor()
    {
    }
    public updateProjection()
    {
        this.aspect = CanvaManager.getHeight/CanvaManager.getWidth;
        this.projection = Matrix.projection(this.fov,this.near,this.far,this.aspect);
    }
    public preRender()
    {
        this.updatePos();
        this.view = Matrix.viewFPS(this.pos,this.yaw,this.pitch);
        this.updateProjection();
    }
    public setYaw(yaw:number)
    {
        this.yaw = yaw;
    }
    public setPitch(pitch:number)
    {
        this.pitch = pitch;
    }
    public setPosition(pos:Vector)
    {
        this.pos = pos;
    }
    public getView()
    {
        return this.view;
    }
    public getProjection()
    {
        return this.projection;
    }
    private updatePos()
    {
        if(CanvaManager.getKey(87))
        {
            this.pos.x+=Math.sin(this.yaw*Math.PI/180)*0.1;
            this.pos.z+=Math.cos(this.yaw*Math.PI/180)*0.1;
        }
        else if(CanvaManager.getKey(83))
        {
            this.pos.x-=Math.sin(this.yaw*Math.PI/180)*0.1;
            this.pos.z-=Math.cos(this.yaw*Math.PI/180)*0.1;
        }
        if(CanvaManager.getKey(68))
        {
            this.pos.x+=Math.sin((this.yaw+90)*Math.PI/180)*0.1;
            this.pos.z+=Math.cos((this.yaw+90)*Math.PI/180)*0.1;
        }
        else if(CanvaManager.getKey(65))
        {
            this.pos.x-=Math.sin((this.yaw+90)*Math.PI/180)*0.1;
            this.pos.z-=Math.cos((this.yaw+90)*Math.PI/180)*0.1;
        }
        if(CanvaManager.getKey(32))
        this.pos.y+=0.1;
        else if(CanvaManager.getKey(16))
        this.pos.y-=0.1;
        this.pitch -= CanvaManager.mouseMovement.y/10;
        this.yaw += CanvaManager.mouseMovement.x/10;
        if(this.pitch>90) this.pitch =90;
        if(this.pitch<-90) this.pitch=-90;
    }
}