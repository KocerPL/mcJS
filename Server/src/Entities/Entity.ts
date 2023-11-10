import { UUID } from "../Main";
import { Vector3 } from "../Utils/Vector3";

export abstract class Entity
{
    uuid:UUID;
    pos:Vector3;
    type:string;
   abstract update();
}