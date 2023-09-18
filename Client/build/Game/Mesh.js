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
        this.vertices.push(...mesh.vertices);
        for (const indice of mesh.indices)
            this.indices.push(indice + ((this.count * 2) / 3));
        this.tCoords.push(...mesh.tCoords);
        this.lightLevels.push(...mesh.lightLevels);
        this.fb.push(...mesh.fb);
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
