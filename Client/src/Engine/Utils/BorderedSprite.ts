import { RenderArrays } from "../RenderArrays.js";
import { Sprite } from "./Sprite.js";
type boundingBox = { x:number;
    y:number,
    dx:number,
    dy:number};
export class BorderedSprite extends Sprite
{
    border:number;
    boundingBoxes:boundingBox[];
    topLeftCorner:boundingBox;
    topRightCorner:boundingBox;
    bottomLeftCorner:boundingBox;
    bottomRightCorner:boundingBox; 
    sprites:Sprite[];
    top:boundingBox;
    right:boundingBox;
    bottom:boundingBox;
    left:boundingBox;
    center:boundingBox;
    constructor(x: number, y: number, dx: number, dy: number,border:number,
        topLeftCorner:boundingBox,
        top:boundingBox,
        topRightCorner:boundingBox,
        left:boundingBox,
        center:boundingBox,
        right:boundingBox,
        bottomLeftCorner:boundingBox,
        bottom:boundingBox,
        bottomRightCorner:boundingBox, 
    )
    {
        super(x,y,dx,dy);
        this.border = border;
        this.topLeftCorner = topLeftCorner;
        this.topRightCorner = topRightCorner;
        this.bottomLeftCorner = bottomLeftCorner;
        this.bottomRightCorner = bottomRightCorner;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
        this.center = center;
        this.boundingBoxes = [];
        this.boundingBoxes.push(topLeftCorner,top,topRightCorner);
        this.boundingBoxes.push(left,center,right);
        this.boundingBoxes.push(bottomLeftCorner,bottom,bottomRightCorner);
        this.sprites = [];
        this.sprites.push(new Sprite(x,dy-border,x+border,dy),new Sprite(x+border,dy-border,dx-border,dy),new Sprite(dx-border,dy-border,dx,dy));
        this.sprites.push(new Sprite(x,y+border,x+border,dy-border),new Sprite(x+border,y+border,dx-border,dy-border),new Sprite(dx-border,y+border,dx,dy-border));
        this.sprites.push(new Sprite(x,y,x+border,y+border),new Sprite(x+border,y,dx-border,y+border),new Sprite(dx-border,y,dx,y+border));

    }
    getRenderArrays(coords:{ x:number;
        y:number,
        dx:number,
        dy:number}| null):RenderArrays
    {   
        const rArrays = new RenderArrays();
        let i=0;
        for(const sprite of this.sprites)
        {
            rArrays.addArr(sprite.getRenderArrays(this.boundingBoxes[i]),i*4);
            i++;
        }
        return  rArrays;
    }
}