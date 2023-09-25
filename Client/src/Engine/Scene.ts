import { GUI } from "../Game/gui/GUI.js";

export abstract class Scene
{
    gui:GUI;
    TPS:number =60;
    abstract start();
   abstract update();
    abstract render();
    abstract  onClick(x:number,y:number);
}