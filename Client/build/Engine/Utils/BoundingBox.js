export class BoundingBox {
    x;
    y;
    dx;
    dy;
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
    getRenderStuff(coords) {
        let vertices = [this.x, this.dy,
            this.dx, this.y,
            this.x, this.y,
            this.dx, this.dy];
        let textureCoords = [
            coords.x, coords.dy,
            coords.dx, coords.y,
            coords.x, coords.y,
            coords.dx, coords.dy,
        ];
        let indices = [0, 1, 2, 1, 0, 3];
        return { vertices, indices, textureCoords };
    }
}
