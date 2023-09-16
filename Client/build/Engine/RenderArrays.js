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
    addArr(rArrays, offset) {
        this.vertices = this.vertices.concat(rArrays.vertices);
        this.textureCoords = this.textureCoords.concat(rArrays.textureCoords);
        for (let indice of rArrays.indices) {
            this.indices.push(indice + offset);
        }
    }
}
