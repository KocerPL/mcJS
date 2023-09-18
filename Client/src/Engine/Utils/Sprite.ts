import { RenderArrays } from "../RenderArrays.js";

export class Sprite
{
    x:number;
    y:number;
    dx:number;
    dy:number;
    constructor(x:number,
        y:number,
        dx:number,
        dy:number)
    {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
    getRenderArrays(coords:{ x:number;
        y:number,
        dx:number,
        dy:number}):RenderArrays
    {   
        const rArrays = new RenderArrays();
        rArrays.vertices =
        [this.x,this.dy,
            this.dx,this.y,
            this.x,this.y,
            this.dx,this.dy];
        rArrays.textureCoords = 
        [
            coords.x,coords.y,
            coords.dx,coords.dy,
            coords.x,coords.dy,
            coords.dx,coords.y,
        ];
        rArrays.indices = [0,1,2,1,0,3];
        return  rArrays;
    }
}