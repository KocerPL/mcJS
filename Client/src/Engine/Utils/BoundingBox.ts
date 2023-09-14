import { Texture2 } from "../Loader";

export class BoundingBox
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
    getRenderStuff(coords:{ x:number;
        y:number,
        dx:number,
        dy:number}):{vertices:number[],textureCoords:number[],indices:number[]}
    {
        let vertices =
        [this.x,this.dy,
        this.dx,this.y,
        this.x,this.y,
        this.dx,this.dy];
        let textureCoords = 
        [
            coords.x,coords.dy,
            coords.dx,coords.y,
            coords.x,coords.y,
            coords.dx,coords.dy,
        ]
        let indices = [0,1,2,1,0,3];
        return {vertices,indices,textureCoords};
    }
}