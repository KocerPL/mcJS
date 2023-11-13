import { UUID, getUUID } from "../Main";
import { Vector3 } from "../Utils/Vector3";
import { Entity } from "./Entity";

export class Item extends Entity
{
    type= "item";
    id:number;
    invurnerableEnd:number= Date.now()+3000;
    constructor(pos:Vector3,id:number,uuid?:UUID)
    {
        super();
        this.pos =new Vector3(pos);
        this.id =id;
        this.uuid = uuid ?? getUUID();
    }
    update()
    {
        
    }
}