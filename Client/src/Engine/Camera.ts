import { CanvaManager } from "./CanvaManager.js";
import { Matrix } from "./Utils/Matrix.js";
import { Vector } from "./Utils/Vector.js";

export class Camera
{
   private projection:Matrix=Matrix.projection(70,1,100,CanvaManager.getHeight/CanvaManager.getWidth);;
   private pos:Vector = new Vector(0,10,-20);
   private view:Matrix=Matrix.viewFPS(this.pos,0,0);
   private yaw = 0;
   private pitch =0;
   private fov =70;
   private near = 0.1;
   private far =10000;
   private aspect =CanvaManager.getHeight/CanvaManager.getWidth;
    public offset = 0;
    public projRot=0;
    constructor()
    {
    }
    public updateProjection()
    {
        this.aspect = CanvaManager.getHeight/CanvaManager.getWidth;
        this.projection = Matrix.projection(this.fov,this.near,this.far,this.aspect);
        this.projection  = this.projection.rotateX(this.projRot);
        this.projection  = this.projection.rotateZ(this.projRot);
        this.projection  = this.projection.translate(0,0,this.offset);
    }
    public preRender()
    {
        this.updatePos();
        this.view = Matrix.viewFPS(this.pos,this.yaw,this.pitch);
        this.updateProjection();
    }
    public getYaw()
    {
        return this.yaw;
    }
    public getPitch()
    {
        return this.pitch;
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
    public getPosition()
    {
        return this.pos;
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
       
    }
}