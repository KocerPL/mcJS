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
    public static mouse = {left:false,right:false};
    public static scrollAmount =0;
   public static setupCanva(location:Node,proportion?:number) : HTMLCanvasElement
    {
        this.proportion = proportion ?? this.proportion;

        location.appendChild(this.canva);
        this.debug.style.position = "absolute";
        this.debug.style.color = "white";
        this.debug.style.top = "0";
        this.debug.style.left = "0";
        location.appendChild(this.debug);
        window.addEventListener("resize",this.onResize.bind(this),false);
        window.addEventListener("keydown",this.onKeyDown.bind(this),false);
        window.addEventListener("keyup",this.onKeyUp.bind(this),false);
        window.addEventListener("mousemove",this.onMouseMove.bind(this),false);
        window.addEventListener("mousedown",this.onMouseDown.bind(this),false);
        window.addEventListener("mouseup",this.onMouseUp.bind(this),false);
        window.addEventListener("wheel",this.onScroll.bind(this),false)
        this.canva.addEventListener("click",()=>{      this.canva.requestPointerLock()},false);
   
    this.onResize();
        return this.canva;
    }
    static onScroll(ev:WheelEvent)
    {
this.scrollAmount+=(Math.round(ev.deltaY/50));
     //   console.log(ev);
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
    private static onMouseDown(ev:MouseEvent)
    {
        if(ev.button == 0)
        this.mouse.left =true;
        else if(ev.button ==2)
        this.mouse.right = true
        ev.preventDefault();
    }
    private static onMouseUp(ev:MouseEvent)
    {
        //console.log(ev)
        if(ev.button == 0)
        this.mouse.left =false;
        else if(ev.button ==2)
        this.mouse.right = false
        ev.preventDefault();
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