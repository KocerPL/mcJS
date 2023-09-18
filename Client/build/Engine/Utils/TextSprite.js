import { RenderArrays } from "../RenderArrays.js";
import { Texture } from "../Texture.js";
import { Sprite } from "./Sprite.js";
export class TextSprite extends Sprite {
    text;
    constructor(x, y, dx, dy, text) {
        super(x, y, dx, dy);
        this.text = text;
    }
    getRenderArrays(coords) {
        const rArrays = new RenderArrays();
        const width = Math.abs(this.x - this.dx);
        const chWidth = width / this.text.length;
        let i = 0;
        for (const char of this.text) {
            rArrays.vertices.push(this.x + (chWidth * i), this.dy, this.x + (chWidth * (i + 1)), this.y, this.x + (chWidth * i), this.y, this.x + (chWidth * (i + 1)), this.dy);
            coords = Texture.fontAtlas.coords[char.charCodeAt(0)];
            rArrays.textureCoords.push(coords.x, coords.y, coords.dx, coords.dy, coords.x, coords.dy, coords.dx, coords.y);
            rArrays.indices.push(i * 0, i * 1, i * 2, i * 1, i * 0, i * 3);
            i++;
        }
        return rArrays;
    }
}
