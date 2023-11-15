import { Entity } from "../Entities/Entity";
import { Vector } from "../Utils/Vector";
import { Vector3 } from "../Utils/Vector3";
import { World } from "./World";

export class Chunk
{
    subchunks:Array<Array<number>>;
    pos:Array<number>;
    static getAt(chunk:Chunk,pos:Vector3)
    {
        let sch = Math.floor(pos.y/16);
        return chunk.subchunks[sch][World.toSubIndex(pos.x,Math.round(pos.y%16),pos.z)];
    }
    static setAt(chunk:Chunk,pos:Vector3,id:number)
    {
        let sch = Math.floor(pos.y/16);
        if(chunk.subchunks[sch])
        chunk.subchunks[sch][World.toSubIndex(pos.x,Math.round(pos.y%16),pos.z)]= id;
    }
}