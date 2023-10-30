import { Entity } from "../Entities/Entity";

export class Chunk
{
    subchunks:Array<Array<number>>;
    pos:Array<number>;
    entities:Array<Entity>= new Array();
}