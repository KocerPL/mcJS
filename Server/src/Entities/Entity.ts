import { UUID } from "../Main";
import { Vector3 } from "../Utils/Vector3";

export abstract class Entity
{
    uuid:UUID;
    pos:Vector3;
    acc:Vector3= new Vector3(0,0,0);
    type:string;
   abstract update();
}