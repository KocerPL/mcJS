import { Loader } from "./Loader.js";

export class Texture
{
    static SIZE = 64;
    static imageSize = 1024;
    static rowSize = 16;
    static blocksGrid = Loader.image("/JS/Engine/Textures/Blocks.png");
    static blocksGridTest = Loader.imageArray("/JS/Engine/Textures/Blocks.png",10,16);
   // static GUI = Loader.image("/JS/Engine/Textures/GUI.png");
    static GUItest = Loader.imageArray("/JS/Engine/Textures/GUI.png",3,9);
    static crossHair = Loader.image("/JS/Engine/Textures/crosshair.png");
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