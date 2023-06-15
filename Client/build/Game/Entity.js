import { RenderSet } from "../Engine/RenderSet.js";
import { Matrix } from "../Engine/Utils/Matrix.js";
export class Entity {
    transformation = Matrix.identity();
    pos;
    rs = new RenderSet();
    id;
    constructor(pos, id) {
        this.id = id;
        this.pos = pos.copy();
    }
    get ID() {
        return this.id;
    }
}
