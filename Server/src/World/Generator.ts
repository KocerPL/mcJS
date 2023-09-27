import { Chunk } from "./Chunk";

export class Generator
{
    WorldSeed = 6969696969696969;
    generate():Chunk
    {
        return new Chunk();
    }
}