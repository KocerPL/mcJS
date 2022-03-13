import { Vector } from "./Utils/Vector.js";
export class CanvaManager {
    static canva = document.createElement("canvas");
    static HEIGHT = window.innerHeight;
    static WIDTH = window.innerWidth;
    static rPointer = true;
    static gl = this.canva.getContext("webgl2");
    static debug = document.createElement("output");
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
        this.scrollAmount += (Math.round(ev.deltaY / 50));
        //   console.log(ev);
    }
    static onMouseMove(ev) {
        // console.log((ev.x/(this.canva.width/2))-1, (ev.y/(this.canva.height/2))-1);
        this.mouse.pos.x = ((ev.x / (this.canva.width / 2)) - 1) / CanvaManager.getProportion;
        this.mouse.pos.y = -((ev.y / (this.canva.height / 2)) - 1);
        this.mouseMovement.x = ev.movementX;
        this.mouseMovement.y = ev.movementY;
    }
    static onKeyDown(ev) {
        this.keys[ev.keyCode] = true;
    }
    static onKeyUp(ev) {
        this.keys[ev.keyCode] = false;
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
    static getKey(keycode) {
        return this.keys[keycode] ?? false;
    }
    static getKeyOnce(keycode) {
        let key = this.keys[keycode];
        this.keys[keycode] = false;
        return key ?? false;
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
