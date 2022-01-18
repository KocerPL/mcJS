import { CanvaManager } from "./CanvaManager.js";
import { Matrix } from "./Utils/Matrix.js";
import { Vector } from "./Utils/Vector.js";
export class Camera {
    projection = Matrix.projection(70, 1, 100, CanvaManager.getHeight / CanvaManager.getWidth);
    ;
    pos = new Vector(0, 10, -20);
    view = Matrix.viewFPS(this.pos, 0, 0);
    yaw = 0;
    pitch = 0;
    fov = 70;
    near = 1;
    far = 100;
    aspect = CanvaManager.getHeight / CanvaManager.getWidth;
    constructor() {
    }
    updateProjection() {
        this.aspect = CanvaManager.getHeight / CanvaManager.getWidth;
        this.projection = Matrix.projection(this.fov, this.near, this.far, this.aspect);
    }
    preRender() {
        this.updatePos();
        this.view = Matrix.viewFPS(this.pos, this.yaw, this.pitch);
        this.updateProjection();
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
    getView() {
        return this.view;
    }
    getProjection() {
        return this.projection;
    }
    updatePos() {
        if (CanvaManager.getKey(87)) {
            this.pos.x += Math.sin(this.yaw * Math.PI / 180) * 0.1;
            this.pos.z += Math.cos(this.yaw * Math.PI / 180) * 0.1;
        }
        else if (CanvaManager.getKey(83)) {
            this.pos.x -= Math.sin(this.yaw * Math.PI / 180) * 0.1;
            this.pos.z -= Math.cos(this.yaw * Math.PI / 180) * 0.1;
        }
        if (CanvaManager.getKey(68)) {
            this.pos.x += Math.sin((this.yaw + 90) * Math.PI / 180) * 0.1;
            this.pos.z += Math.cos((this.yaw + 90) * Math.PI / 180) * 0.1;
        }
        else if (CanvaManager.getKey(65)) {
            this.pos.x -= Math.sin((this.yaw + 90) * Math.PI / 180) * 0.1;
            this.pos.z -= Math.cos((this.yaw + 90) * Math.PI / 180) * 0.1;
        }
        if (CanvaManager.getKey(32))
            this.pos.y += 0.1;
        else if (CanvaManager.getKey(16))
            this.pos.y -= 0.1;
        this.pitch -= CanvaManager.mouseMovement.y / 10;
        this.yaw += CanvaManager.mouseMovement.x / 10;
        if (this.pitch > 90)
            this.pitch = 90;
        if (this.pitch < -90)
            this.pitch = -90;
    }
}
