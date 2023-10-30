"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector3 = void 0;
class Vector3 {
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(vec) {
        let outVec = new Vector3();
        outVec.x = this.x + vec.x;
        outVec.y = this.y + vec.y;
        outVec.z = this.z + vec.z;
        return outVec;
    }
    multiply(scalar) {
        let outVec = new Vector3();
        outVec.x = this.x * scalar;
        outVec.y = this.y * scalar;
        outVec.z = this.z * scalar;
        return outVec;
    }
    copy() {
        return new Vector3(this.x, this.y, this.z);
    }
}
exports.Vector3 = Vector3;
