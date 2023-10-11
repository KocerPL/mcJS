import { GUI } from "../Game/gui/GUI.js";

export abstract class Scene
{
    gui:GUI;
    TPS =60;
    abstract start();
   abstract update();
    abstract render();
    abstract  onClick(x:number,y:number);
    abstract onKey(key:string):void;
}