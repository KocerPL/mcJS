import { RenderSet } from "../Engine/RenderSet.js";
import { Matrix4 } from "../Engine/Utils/Matrix4.js";
export class Entity {
    transformation = Matrix4.identity();
    pos;
    rs;
    id;
    constructor(pos, shad, id) {
        this.rs = new RenderSet(shad);
        this.id = id;
        this.pos = pos.copy();
    }
    get ID() {
        return this.id;
    }
}
