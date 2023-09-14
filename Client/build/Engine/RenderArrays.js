export class RenderArrays {
    index = 0;
    vertices = [];
    textureCoords = [];
    skyLight = [];
    blockLight = [];
    indices = [];
    count = 0;
    resetArrays() {
        this.vertices = [];
        this.textureCoords = [];
        this.skyLight = [];
        this.blockLight = [];
        this.indices = [];
        this.index = 0;
    }
}
