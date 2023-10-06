import { Main } from "../Main.js";
import { Vector } from "./Utils/Vector.js";
class CanvaManager {
    static canva = document.createElement("canvas");
    static HEIGHT = window.innerHeight;
    static WIDTH = window.innerWidth;
    static rPointer = false;
    static gl = this.canva.getContext("webgl2");
    static debug = document.createElement("span");
    static proportion = 1024 / 1920;
    static keys = new Array(100);
    static mouseMovement = new Vector(0, 0, 0);
    static mouse = { left: false, right: false, pos: new Vector(0, 0, 0) };
    static scrollAmount = 0;
    static setupCanva(location, proportion) {
        this.proportion = proportion ?? this.proportion;
        location.appendChild(this.canva);
        this.debug.style.position = "absolute";
        this.debug.style.color = "white";
        this.debug.style.top = "0";
        this.debug.style.left = "0";
        location.appendChild(this.debug);
        window.addEventListener("click", ev => { Main.scene.onClick((((ev.x / this.WIDTH) * 2) - 1) / CanvaManager.getProportion, ((ev.y / this.HEIGHT) * 2) - 1); console.log("TEST"); });
        window.addEventListener("resize", this.onResize.bind(this), false);
        window.addEventListener("keydown", this.onKeyDown.bind(this), false);
        window.addEventListener("keyup", this.onKeyUp.bind(this), false);
        window.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        window.addEventListener("mousedown", this.onMouseDown.bind(this), false);
        window.addEventListener("mouseup", this.onMouseUp.bind(this), false);
        window.addEventListener("wheel", this.onScroll.bind(this), false);
        this.canva.addEventListener("click", () => { if (this.rPointer)
            this.canva.requestPointerLock(); }, false);
        this.onResize();
        return this.canva;
    }
    static onScroll(ev) {
        this.scrollAmount += (Math.round(ev.deltaY / 100));
        //   console.log(ev);
    }
    static unlockPointer() {
        document.exitPointerLock();
    }
    static onMouseMove(ev) {
        // console.log((ev.x/(this.canva.width/2))-1, (ev.y/(this.canva.height/2))-1);
        this.mouse.pos.x = ((ev.x / (this.canva.width / 2)) - 1) / CanvaManager.getProportion;
        this.mouse.pos.y = -((ev.y / (this.canva.height / 2)) - 1);
        this.mouseMovement.x += ev.movementX;
        this.mouseMovement.y += ev.movementY;
    }
    static onKeyDown(ev) {
        console.log(ev.key);
        this.keys[ev.key.toUpperCase()] = true;
        ev.preventDefault();
    }
    static onKeyUp(ev) {
        this.keys[ev.key.toUpperCase()] = false;
        ev.preventDefault();
    }
    static onMouseDown(ev) {
        if (ev.button == 0)
            this.mouse.left = true;
        else if (ev.button == 2)
            this.mouse.right = true;
        ev.preventDefault();
    }
    static onMouseUp(ev) {
        //console.log(ev)
        if (ev.button == 0)
            this.mouse.left = false;
        else if (ev.button == 2)
            this.mouse.right = false;
        ev.preventDefault();
    }
    static getKey(key) {
        return this.keys[key] ?? false;
    }
    static getKeyOnce(keyS) {
        const key = this.keys[keyS];
        this.keys[keyS] = false;
        return key ?? false;
    }
    static onResize() {
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;
        this.proportion = this.HEIGHT / this.WIDTH;
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
export { CanvaManager };
