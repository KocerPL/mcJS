import { RenderSet } from "../Engine/RenderSet.js";
import { Matrix } from "../Engine/Utils/Matrix.js";
export class Entity {
    transformation = Matrix.identity();
    pos;
    rs = new RenderSet();
    constructor(pos) {
        this.pos = pos.copy();
    }
}
