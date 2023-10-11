import { Main } from "../Main.js";
import { Vector } from "./Utils/Vector.js";

export class CanvaManager
{
    private static canva:HTMLCanvasElement = document.createElement("canvas"); 
    private static HEIGHT:number = window.innerHeight;
    private static WIDTH:number = window.innerWidth;
    public static rPointer =false;
    public static gl:WebGL2RenderingContext =this.canva.getContext("webgl2");
    public static debug:HTMLSpanElement = document.createElement("span"); 
    private static proportion:number  = 1024/1920;
    private static keys:Array<boolean> = new Array(100);
    public static mouseMovement = new Vector(0,0,0);
    public static mouse = {left:false,right:false,pos: new Vector(0,0,0)};
    public static scrollAmount =0;
    public static setupCanva(location:Node,proportion?:number) : HTMLCanvasElement
    {
        this.proportion = proportion ?? this.proportion;

        location.appendChild(this.canva);

            if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)){
            let controlDiv = document.createElement("div");
            let upDiv = document.createElement("div");
            let downDiv = document.createElement("div");
            let rightDiv = document.createElement("div");
            let leftDiv = document.createElement("div");
            upDiv.id = "up";
            leftDiv.id = "left";
            rightDiv.id = "right";
            downDiv.id = "down";
            controlDiv.id = "control"
            location.appendChild(controlDiv);
            controlDiv.appendChild(upDiv);
            controlDiv.appendChild(downDiv);
            controlDiv.appendChild(rightDiv);
            controlDiv.appendChild(leftDiv);
           upDiv.addEventListener("touchstart",()=>{
                this.keys["W"] = true;
            },true);
            upDiv.addEventListener("touchend",()=>{
                this.keys["W"] =false;
            },true)

            rightDiv.addEventListener("touchstart",()=>{
                this.keys["D"] = true;
            },true);
            rightDiv.addEventListener("touchend",()=>{
                this.keys["D"] =false;
            },true)

            leftDiv.addEventListener("touchstart",()=>{
                this.keys["A"] = true;
            },true);
            leftDiv.addEventListener("touchend",()=>{
                this.keys["A"] =false;
            },true)

            downDiv.addEventListener("touchstart",()=>{
                this.keys["S"] = true;
            },true);
            downDiv.addEventListener("touchend",()=>{
                this.keys["S"] =false;
            },true)
         }
        this.debug.style.position = "absolute";
        this.debug.style.color = "white";
        this.debug.style.top = "0";
        this.debug.style.left = "0";
        location.appendChild(this.debug);
        window.addEventListener("click",ev=>{Main.scene.onClick((((ev.x/this.WIDTH)*2)-1)/CanvaManager.getProportion,((ev.y/this.HEIGHT)*2)-1); console.log("TEST");});
        window.addEventListener("resize",this.onResize.bind(this),false);
        window.addEventListener("keydown",this.onKeyDown.bind(this),false);
        window.addEventListener("keyup",this.onKeyUp.bind(this),false);
        window.addEventListener("mousemove",this.onMouseMove.bind(this),false);
        window.addEventListener("mousedown",this.onMouseDown.bind(this),false);
        window.addEventListener("mouseup",this.onMouseUp.bind(this),false);
        window.addEventListener("wheel",this.onScroll.bind(this),false);
        window.addEventListener("touchstart", this.onTouchStart.bind(this));
        window.addEventListener("touchmove", this.onTouchMove.bind(this));
        this.canva.addEventListener("click",()=>{ if(this.rPointer) this.canva.requestPointerLock();},false);
   
        this.onResize();
        return this.canva;
    }
    static onScroll(ev:WheelEvent)
    {
        this.scrollAmount+=(Math.round(ev.deltaY/100));
        //   console.log(ev);
    }
    static onTouchStart(ev:TouchEvent)
    {
        this.mouse.pos.x =  ev.touches[0].clientX;
        this.mouse.pos.y =  ev.touches[0].clientY;
      
       ev.preventDefault();
    }
    static onTouchMove(ev:TouchEvent)
    {
        this.mouseMovement.x += this.mouse.pos.x-ev.touches[0].clientX;
        this.mouseMovement.y += this.mouse.pos.y-ev.touches[0].clientY;
        this.mouse.pos.x =  ev.touches[0].clientX;
        this.mouse.pos.y =  ev.touches[0].clientY;
       ev.preventDefault();
    }
    public static unlockPointer()
    {
        document.exitPointerLock();
    }
    static onMouseMove(ev: MouseEvent) 
    {
        // console.log((ev.x/(this.canva.width/2))-1, (ev.y/(this.canva.height/2))-1);
        this.mouse.pos.x = ((ev.x/(this.canva.width/2))-1)/CanvaManager.getProportion;
        this.mouse.pos.y = -((ev.y/(this.canva.height/2))-1); 
        this.mouseMovement.x += ev.movementX;
        this.mouseMovement.y += ev.movementY;
    }
    private static onKeyDown(ev:KeyboardEvent)
    {
        console.log(ev.key);
        Main.scene.onKey(ev.key);
        this.keys[ev.key.toUpperCase()] = true;
        ev.preventDefault();
    }
    private static onKeyUp(ev:KeyboardEvent)
    {
        this.keys[ev.key.toUpperCase()] = false;
        ev.preventDefault();
    }
    private static onMouseDown(ev:MouseEvent)
    {
        if(ev.button == 0)
            this.mouse.left =true;
        else if(ev.button ==2)
            this.mouse.right = true;
        ev.preventDefault();
    }
    private static onMouseUp(ev:MouseEvent)
    {
        //console.log(ev)
        if(ev.button == 0)
            this.mouse.left =false;
        else if(ev.button ==2)
            this.mouse.right = false;
        ev.preventDefault();
    }
    public static getKey(key:string)
    {
        return this.keys[key] ?? false;
    }
    public static getKeyOnce(keyS:string)
    {
        const key = this.keys[keyS];
        this.keys[keyS] =false;
        return key ?? false;
    }
    private static onResize():void
    {
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;
        this.proportion = this.HEIGHT/this.WIDTH;
        this.gl.viewport(0,0,this.WIDTH,this.HEIGHT);
        this.applyResize();
    }
    public static preRender()
    {
        CanvaManager.mouseMovement.x=0;
        CanvaManager.mouseMovement.y=0;

    }
    private static applyResize():void
    {
        this.canva.width = this.WIDTH;
        this.canva.height = this.HEIGHT;
    }
    public static get getProportion():number
    {
        return this.proportion;
    }
    public static get getWidth():number
    {
        return this.WIDTH;
    }
    public static get getHeight():number
    {
        return this.HEIGHT;
    }
}