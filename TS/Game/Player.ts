import { Camera } from "../Engine/Camera";
import { Vector } from "../Engine/Utils/Vector";

export class Player
{
    camera:Camera = new Camera();
    constructor(pos:Vector)
    {
        this.camera.setPosition(new Vector(pos.x,pos.y+1,pos.z));
        
    }
    mine()
    {
        
    }
}