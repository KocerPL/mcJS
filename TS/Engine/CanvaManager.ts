export class CanvaManager
{
    private static canva:HTMLCanvasElement = document.createElement("canvas"); 
    private static HEIGHT:number = window.innerHeight;
    private static WIDTH:number = window.innerWidth;
    public static gl:WebGL2RenderingContext =this.canva.getContext("webgl2");
    private static proportion:number  = 1024/1920;
   public static setupCanva(location:Node,proportion?:number) : HTMLCanvasElement
    {
        this.proportion = proportion ?? this.proportion;

        location.appendChild(this.canva);
        window.addEventListener("resize",this.onResize.bind(this),false);
    this.onResize();
        return this.canva;
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
        this.applyResize();
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
}