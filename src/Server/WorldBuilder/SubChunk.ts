import { Vector } from "../../Engine/Utils/Vector";

export class SubChunk
{
    pos:Vector;
    blocks:Array<number> = new Array(); // x = %16 y = /16 z= /256
    lightMap:Array<number> = new Array();
    constructor(pos:Vector)
    {
        this.pos=pos;
    }
}