import { Vector } from "./Utils/Vector.js";

export class CanvaManager
{
    private static canva:HTMLCanvasElement = document.createElement("canvas"); 
    private static HEIGHT:number = window.innerHeight;
    private static WIDTH:number = window.innerWidth;
    public static gl:WebGL2RenderingContext =this.canva.getContext("webgl2");
    public static debug:HTMLOutputElement = document.createElement("output"); 
    private static proportion:number  = 1024/1920;
    private static keys:Array<Boolean> = new Array(100);
    public static mouseMovement = new Vector(0,0,0);
   public static setupCanva(location:Node,proportion?:number) : HTMLCanvasElement
    {
        this.proportion = proportion ?? this.proportion;

        location.appendChild(this.canva);
        this.debug.style.position = "absolute";
        this.debug.style.top = "0";
        this.debug.style.left = "0";
        location.appendChild(this.debug);
        window.addEventListener("resize",this.onResize.bind(this),false);
        window.addEventListener("keydown",this.onKeyDown.bind(this),false);
        window.addEventListener("keyup",this.onKeyUp.bind(this),false);
        window.addEventListener("mousemove",this.onMouseMove.bind(this),false);
        this.canva.addEventListener("click",()=>{      this.canva.requestPointerLock()},false);
   
    this.onResize();
        return this.canva;
    }
    static onMouseMove(ev: MouseEvent) 
    {
        this.mouseMovement.x = ev.movementX;
        this.mouseMovement.y = ev.movementY;
    }
    private static onKeyDown(ev)
    {
        this.keys[ev.keyCode] = true;
    }
    private static onKeyUp(ev)
    {
        this.keys[ev.keyCode] = false;
    }
    public static getKey(keycode:number)
    {
        return this.keys[keycode] ?? false;
    }
    private static onResize():void
    {
        if(window.innerHeight>window.innerWidth)
        {
            this.WIDTH = window.innerWidth;
            this.HEIGHT = window.innerWidth*this.proportion;
        }
        else
        {
            
            this.WIDTH = window.innerHeight/this.proportion;
            this.HEIGHT = window.innerHeight;
        }
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