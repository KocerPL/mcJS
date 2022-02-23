export class World {
    Chunks = new Array();
    static heightMap = new Array(256);
    static init() {
        this.genHeightMap();
    }
    static genHeightMap() {
        let height = 10;
        let height2 = 10;
        for (let x = 0; x < 256; x++) {
            if (x % 4)
                height += Math.round(Math.random() * 2) - 1;
            this.heightMap[x] = new Array();
            for (let z = 0; z < 256; z++) {
                try {
                    if (z != 0) {
                        height2 = Math.round((Math.random() * 2) - 1) + this.heightMap[x][z - 1];
                        while (height2 > this.heightMap[x - 1][z] + 1) {
                            height2 -= 1;
                        }
                        while (height2 < this.heightMap[x - 1][z] - 1) {
                            height2 += 1;
                        }
                    }
                    else
                        height2 = height;
                }
                catch (error) {
                }
                this.heightMap[x][z] = height2;
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
