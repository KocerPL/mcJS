import { Matrix4 } from "../../Engine/Utils/Matrix4";
class Inventory {
    visible = true;
    changed;
    transformation;
    vertices;
    textureCoords;
    skyLight;
    blockLight;
    indices;
    constructor() {
        this.transformation = Matrix4.identity();
    }
}
