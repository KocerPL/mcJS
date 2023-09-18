import { RenderArrays } from "../RenderArrays.js";
import { Texture } from "../Texture.js";
import { Sprite } from "./Sprite.js";

export class TextSprite extends Sprite
{
   public text:string;
    constructor(x:number,
        y:number,
        dx:number,
        dy:number,text:string)
    {
        super(x,y,dx,dy);
        this.text = text;
    }
    getRenderArrays(coords:{ x:number;
        y:number,
        dx:number,
        dy:number}):RenderArrays
    {   
        const rArrays = new RenderArrays();
        const width = Math.abs(this.x-this.dx);
        let i=0;
        for(const char of this.text)
        {
            rArrays.vertices.push(this.x+(width*i),this.dy,                    
                this.x+(width*(i+1)),this.y,
                this.x+(width*i),this.y,
                this.x+(width*(i+1)),this.dy);
            coords= Texture.fontAtlas.coords[char.charCodeAt(0)];
            rArrays.textureCoords.push(
        
                coords.x,coords.y,
                coords.dx,coords.dy,
                coords.x,coords.dy,
                coords.dx,coords.y,
            );
            rArrays.indices.push ((4*i)+2,(4*i)+1,(4*i)+0,(4*i)+3,(4*i)+0,(4*i)+1);
            i++;
          
        }
        
        
        return  rArrays;
    }
}