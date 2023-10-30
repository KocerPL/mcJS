import { Vector3 } from "../Utils/Vector3";
import { Entity } from "./Entity";

export class Item extends Entity
{
    type= "item";
    id:number
    constructor(pos:Vector3,id:number)
    {
        super();
        this.pos =pos;
        this.id =id;
    }
}