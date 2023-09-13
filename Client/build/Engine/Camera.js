import { CanvaManager } from "./CanvaManager.js";
import { Matrix4 } from "./Utils/Matrix4.js";
import { Vector } from "./Utils/Vector.js";
export class Camera {
    projection = Matrix4.projection(70, 1, 100, CanvaManager.getHeight / CanvaManager.getWidth);
    pos = new Vector(0, 10, -20);
    view = Matrix4.viewFPS(this.pos, 0, 0);
    yaw = 0;
    pitch = 0;
    fov = 70;
    near = 0.1;
    far = 10000;
    aspect = CanvaManager.getHeight / CanvaManager.getWidth;
    offset = 0;
    projRot = 0;
    constructor() {
    }
    updateProjection() {
        this.aspect = CanvaManager.getHeight / CanvaManager.getWidth;
        this.projection = Matrix4.projection(this.fov, this.near, this.far, this.aspect);
        this.projection = this.projection.rotateX(this.projRot);
        this.projection = this.projection.rotateZ(this.projRot);
        this.projection = this.projection.translate(0, 0, this.offset);
    }
    preRender() {
        this.updatePos();
        this.view = Matrix4.viewFPS(this.pos, this.yaw, this.pitch);
        this.updateProjection();
    }
    getYaw() {
        return this.yaw;
    }
    getPitch() {
        return this.pitch;
    }
    setYaw(yaw) {
        this.yaw = yaw;
    }
    setPitch(pitch) {
        this.pitch = pitch;
    }
    setPosition(pos) {
        this.pos = pos;
    }
    getPosition() {
        return this.pos;
    }
    getView() {
        return this.view;
    }
    getProjection() {
        return this.projection;
    }
    updatePos() {
    }
}
