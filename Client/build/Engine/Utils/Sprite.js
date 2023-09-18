import { RenderArrays } from "../RenderArrays.js";
export class Sprite {
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
    getRenderArrays(coords) {
        const rArrays = new RenderArrays();
        rArrays.vertices =
            [this.x, this.dy,
                this.dx, this.y,
                this.x, this.y,
                this.dx, this.dy];
        rArrays.textureCoords =
            [
                coords.x, coords.y,
                coords.dx, coords.dy,
                coords.x, coords.dy,
                coords.dx, coords.y,
            ];
        rArrays.indices = [2, 1, 0, 3, 0, 1];
        return rArrays;
    }
}
