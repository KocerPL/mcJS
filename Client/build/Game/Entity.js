import { RenderSet } from "../Engine/RenderSet.js";
import { Matrix4 } from "../Engine/Utils/Matrix4.js";
export class Entity {
    transformation = Matrix4.identity();
    pos;
    rs;
    uuid;
    constructor(pos, shad, uuid) {
        this.rs = new RenderSet(shad);
        this.uuid = uuid;
        this.pos = pos.copy();
    }
    get UUID() {
        return this.uuid;
    }
}
