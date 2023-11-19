import { CanvaManager } from "./CanvaManager.js";
import { Matrix4 } from "./Utils/Matrix4.js";
import { Vector4 } from "./Utils/Vector4.js";
import { Vector3 } from "./Utils/Vector3.js";

export class Camera
{
    private projection:Matrix4=Matrix4.projection(70,1,100,CanvaManager.getHeight/CanvaManager.getWidth);
    private pos:Vector4 = new Vector4(0,10,-20);
    private view:Matrix4=Matrix4.viewFPS(this.pos,0,0);
    private yaw = 0;
    private pitch =0;
    private fov =70;
    private near = 0.1;
    private far =10000;
    private aspect =CanvaManager.getHeight/CanvaManager.getWidth;
    public offset:Vector3 = new Vector3(0,0,0);
    public projRot=0;
    public updateProjection()
    {
        this.aspect = CanvaManager.getHeight/CanvaManager.getWidth;
        this.projection = Matrix4.projection(this.fov,this.near,this.far,this.aspect);
        this.projection  = this.projection.rotateX(this.projRot);
        this.projection  = this.projection.rotateZ(this.projRot);
        this.projection  = this.projection.translate(this.offset.x,this.offset.y,this.offset.z);
    }
    public preRender()
    {
        this.view = Matrix4.viewFPS(this.pos,this.yaw,this.pitch);
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
    public setPosition(pos:Vector4)
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
}