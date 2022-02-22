export class World {
    Chunks = new Array();
    static heightMap = new Array(256);
    static init() {
        this.genHeightMap();
    }
    static genHeightMap() {
        for (let x = 0; x < 256; x++) {
            this.heightMap[x] = new Array();
            for (let z = 0; z < 256; z++) {
                this.heightMap[x][z] = 10;
            }
        }
    }
    static getHeight(x, z) {
        try {
            return this.heightMap[x][z];
        }
        catch (error) { }
        return 0;
    }
    getBlock() {
    }
}
