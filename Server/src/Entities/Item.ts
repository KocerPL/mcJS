import { Main, UUID, getUUID } from "../Main";
import { clamp } from "../Utils";
import { Vector3 } from "../Utils/Vector3";
import { Entity } from "./Entity";

export class Item extends Entity
{
    type= "item";
    id:number;
    invurnerableEnd:number= Date.now()+1000;
    friction:number = 0.3;
    constructor(pos:Vector3,id:number,uuid?:UUID)
    {
        super();
        this.pos =new Vector3(pos);
        this.id =id;
        this.uuid = uuid ?? getUUID();
    }
    update()
    {
        let oldPos = this.pos.copy();
        this. pos =this.pos.add(this.acc);
        let bottPos =this.pos.copy();
        bottPos.y-=0.5;
        if(Main.world.getBlockID(bottPos)>0) this.acc.y=0; else this.acc.y-=0.1;
        this.acc.y = clamp(this.acc.y,-1,1);
       this.acc = this.acc.add(this.acc.multiply(-this.friction).setY(0));
        if(Vector3.distance(oldPos,this.pos)>0.1)
        Main.networkManager.io.volatile.emit("updateEntity", this);
    }
}