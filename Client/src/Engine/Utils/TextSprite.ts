import { RenderArrays } from "../RenderArrays.js";
import { Texture } from "../Texture.js";
import { Sprite } from "./Sprite.js";
export enum ALIGN
 {
left,
center,
right    
}
export class TextSprite extends Sprite
{

    public text:string;
    private align:ALIGN;
    private renderFromTop:boolean;
    constructor(x:number,
        y:number,
        dx:number,
        dy:number,text:string,align?:ALIGN,renderFromTop?:boolean)
    {
        super(x,y,dx,dy);
        this.text = text;
        this.renderFromTop = renderFromTop??true;
        this.align = align??ALIGN.left;
    }
    getRenderArrays(coords:{ x:number;
        y:number,
        dx:number,
        dy:number}):RenderArrays
    {   
        const rArrays = new RenderArrays();
        const width = Math.abs(this.x-this.dx);
        const height = Math.abs(this.y-this.dy);
        let i=0;
        const textWidth = width*this.text.length;
        let offset=width/2;
        switch(this.align)
        {
        case ALIGN.center:
            offset=(-textWidth/2)+width/2;
            break;
        case ALIGN.right:
            offset=-textWidth+width/2;
            break;
        }
        let lbCount =0;
        for(const char of this.text)
            if(char=="\n")
                lbCount++;
        
        let lineBreaks =this.renderFromTop?(-height/2):lbCount+(height/2);
        let index= 0;
        for(const char of this.text)
        {
            if(char == "\n") {lineBreaks--; i=0;continue;}
            rArrays.vertices.push(this.x+(width*i)+offset,this.dy+(height*lineBreaks),                    
                this.x+(width*(i+1))+offset,this.y+(height*(lineBreaks)),
                this.x+(width*i)+offset,this.y+(height*lineBreaks),
                this.x+(width*(i+1))+offset,this.dy+(height*lineBreaks));
            coords= Texture.fontAtlas.coords[char.charCodeAt(0)];
            rArrays.textureCoords.push(
        
                coords.x,coords.y,
                coords.dx,coords.dy,
                coords.x,coords.dy,
                coords.dx,coords.y,
            );
            rArrays.indices.push ((4*index)+2,(4*index)+1,(4*index)+0,(4*index)+3,(4*index)+0,(4*index)+1);
            i++;
            index++;
        }
        
        
        return  rArrays;
    }
}