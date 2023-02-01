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
        this.vertices = this.vertices.concat(mesh.vertices);
        this.indices = this.indices.concat(mesh.indices);
        this.tCoords = this.tCoords.concat(mesh.tCoords);
        this.lightLevels = this.lightLevels.concat(mesh.lightLevels);
        this.fb = this.fb.concat(mesh.fb);
        this.count = this.indices.length;
    }
    reset() {
        this.vertices = new Array();
        this.indices = new Array();
        this.tCoords = new Array();
        this.fb = new Array();
        this.lightLevels = new Array();
        this.count = 0;
    }
}
