import { Vector } from "./Utils/Vector.js";

export class CanvaManager
{
    private static canva:HTMLCanvasElement = document.createElement("canvas"); 
    private static HEIGHT:number = window.innerHeight;
    private static WIDTH:number = window.innerWidth;
    public static rPointer =true;
    public static gl:WebGL2RenderingContext =this.canva.getContext("webgl2");
    public static debug:HTMLOutputElement = document.createElement("output"); 
    private static proportion:number  = 1024/1920;
    private static keys:Array<Boolean> = new Array(100);
    public static mouseMovement = new Vector(0,0,0);
    public static mouse = {left:false,right:false,pos: new Vector(0,0,0)};
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
        this.canva.addEventListener("click",()=>{ if(this.rPointer) this.canva.requestPointerLock()},false);
   
    this.onResize();
        return this.canva;
    }
    static onScroll(ev:WheelEvent)
    {
this.scrollAmount+=(Math.round(ev.deltaY/100));
     //   console.log(ev);
    }
    static onMouseMove(ev: MouseEvent) 
    {
       // console.log((ev.x/(this.canva.width/2))-1, (ev.y/(this.canva.height/2))-1);
       this.mouse.pos.x = ((ev.x/(this.canva.width/2))-1)/CanvaManager.getProportion;
       this.mouse.pos.y = -((ev.y/(this.canva.height/2))-1); 
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
    public static getKeyOnce(keycode:number)
    {
        let key = this.keys[keycode];
        this.keys[keycode] =false;
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