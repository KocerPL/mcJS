import { Loader } from "./Loader.js";

export class Texture
{
    static SIZE = (1024/16);
    static blocksGrid = Loader.image("/JS/Engine/Textures/Blocks.png");
    x:number;
    y:number;
    dx:number;
    dy:number;
    constructor(x:number,y:number)
    {
        this.x = 1/ (Texture.SIZE*x);
        this.y = 1/(Texture.SIZE*y);
        this.dx = 1/((Texture.SIZE*x)+Texture.SIZE);
        this.dy = 1/((Texture.SIZE*y)+Texture.SIZE);
    }
}