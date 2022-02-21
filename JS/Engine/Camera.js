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
