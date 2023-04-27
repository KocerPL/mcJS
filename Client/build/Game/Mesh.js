export class Mesh {
    vertices = [];
    indices = [];
    tCoords = [];
    lightLevels = [];
    fb = [];
    count = 0;
    constructor() {
        this.reset();
    }
    add(mesh) {
        this.count = this.indices.length;
        this.vertices = this.vertices.concat(mesh.vertices);
        for (const indice of mesh.indices)
            this.indices.push(indice + ((this.count * 2) / 3));
        this.tCoords = this.tCoords.concat(mesh.tCoords);
        this.lightLevels = this.lightLevels.concat(mesh.lightLevels);
        this.fb = this.fb.concat(mesh.fb);
        this.count = this.indices.length;
    }
    reset() {
        delete this.vertices;
        delete this.indices;
        delete this.tCoords;
        delete this.fb;
        delete this.count;
        this.vertices = [];
        this.indices = [];
        this.tCoords = [];
        this.fb = [];
        this.lightLevels = [];
        this.count = 0;
    }
}
