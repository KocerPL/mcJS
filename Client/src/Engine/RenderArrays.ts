export class RenderArrays
{
    index = 0;
    vertices:Array<number> = [];
    textureCoords:Array<number> = [];
    skyLight:Array<number> = [];
    blockLight:Array<number> = [];
    indices:Array<number> = [];
    count=0;
    resetArrays()
    {
        this.vertices = [];
        this.textureCoords = [];
        this.skyLight = [];
        this.blockLight = [];
        this.indices = [];
        this.index=0;
    }
}