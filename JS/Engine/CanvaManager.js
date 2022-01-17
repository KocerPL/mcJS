import { Vector } from "./Utils/Vector.js";
export class CanvaManager {
    static canva = document.createElement("canvas");
    static HEIGHT = window.innerHeight;
    static WIDTH = window.innerWidth;
    static gl = this.canva.getContext("webgl2");
    static debug = document.createElement("output");
    static proportion = 1024 / 1920;
    static keys = new Array(100);
    static mouseMovement = new Vector(0, 0, 0);
    static setupCanva(location, proportion) {
        this.proportion = proportion ?? this.proportion;
        location.appendChild(this.canva);
        this.debug.style.position = "absolute";
        this.debug.style.top = "0";
        this.debug.style.left = "0";
        location.appendChild(this.debug);
        window.addEventListener("resize", this.onResize.bind(this), false);
        window.addEventListener("keydown", this.onKeyDown.bind(this), false);
        window.addEventListener("keyup", this.onKeyUp.bind(this), false);
        window.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        this.canva.addEventListener("click", () => { this.canva.requestPointerLock(); }, false);
        this.onResize();
        return this.canva;
    }
    static onMouseMove(ev) {
        console.log(ev);
        this.mouseMovement.x = ev.movementX;
        this.mouseMovement.y = ev.movementY;
    }
    static onKeyDown(ev) {
        this.keys[ev.keyCode] = true;
    }
    static onKeyUp(ev) {
        this.keys[ev.keyCode] = false;
    }
    static getKey(keycode) {
        console.log(this.keys[keycode]);
        return this.keys[keycode] ?? false;
    }
    static onResize() {
        if (window.innerHeight > window.innerWidth) {
            this.WIDTH = window.innerWidth;
            this.HEIGHT = window.innerWidth * this.proportion;
        }
        else {
            this.WIDTH = window.innerHeight / this.proportion;
            this.HEIGHT = window.innerHeight;
        }
        this.gl.viewport(0, 0, this.WIDTH, this.HEIGHT);
        this.applyResize();
    }
    static preRender() {
        CanvaManager.mouseMovement.x = 0;
        CanvaManager.mouseMovement.y = 0;
    }
    static applyResize() {
        this.canva.width = this.WIDTH;
        this.canva.height = this.HEIGHT;
    }
    static get getProportion() {
        return this.proportion;
    }
    static get getWidth() {
        return this.WIDTH;
    }
    static get getHeight() {
        return this.HEIGHT;
    }
}
