import { RenderArrays } from "../RenderArrays.js";
import { Texture } from "../Texture.js";
import { Sprite } from "./Sprite.js";
export var ALIGN;
(function (ALIGN) {
    ALIGN[ALIGN["left"] = 0] = "left";
    ALIGN[ALIGN["center"] = 1] = "center";
    ALIGN[ALIGN["right"] = 2] = "right";
})(ALIGN || (ALIGN = {}));
export class TextSprite extends Sprite {
    text;
    align;
    constructor(x, y, dx, dy, text, align) {
        super(x, y, dx, dy);
        this.text = text;
        this.align = align ?? ALIGN.left;
    }
    getRenderArrays(coords) {
        const rArrays = new RenderArrays();
        const width = Math.abs(this.x - this.dx);
        let i = 0;
        let textWidth = width * this.text.length;
        let offset = 0;
        switch (this.align) {
            case ALIGN.center:
                offset = -textWidth / 2;
                break;
            case ALIGN.right:
                offset = -textWidth;
                break;
        }
        for (const char of this.text) {
            rArrays.vertices.push(this.x + (width * i) + offset, this.dy, this.x + (width * (i + 1)) + offset, this.y, this.x + (width * i) + offset, this.y, this.x + (width * (i + 1)) + offset, this.dy);
            coords = Texture.fontAtlas.coords[char.charCodeAt(0)];
            rArrays.textureCoords.push(coords.x, coords.y, coords.dx, coords.dy, coords.x, coords.dy, coords.dx, coords.y);
            rArrays.indices.push((4 * i) + 2, (4 * i) + 1, (4 * i) + 0, (4 * i) + 3, (4 * i) + 0, (4 * i) + 1);
            i++;
        }
        return rArrays;
    }
}
