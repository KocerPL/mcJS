"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
class Vector {
    x;
    y;
    z;
    w;
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w ?? 1;
    }
    copy() {
        return new Vector(this.x, this.y, this.z, this.w);
    }
    abs() {
        return new Vector(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
    }
    static add(vecA, vecB) {
        return new Vector(vecA.x + vecB.x, vecA.y + vecB.y, vecA.z + vecB.z);
    }
    equals(vec) {
        return (vec.x == this.x && vec.y == this.y && vec.z == this.z);
    }
    round() {
        return new Vector(Math.round(this.x), Math.round(this.y), Math.round(this.z));
    }
    mult(scalar) {
        return new Vector(this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar);
    }
    modulo(mod, mask) {
        mask ??= { x: 1, y: 1, z: 1 };
        return new Vector(mask.x ? this.x % mod : this.x, mask.y ? this.y % mod : this.y, mask.z ? this.z % mod : this.z);
    }
    static fromData(data) {
        return new Vector(data.x, data.y, data.z, data.w ?? 0);
    }
    static distance(vecA, vecB) {
        return Math.sqrt(((vecA.x + vecB.x) ^ 2) + ((vecA.y + vecB.y) ^ 2) + ((vecA.z + vecB.z) ^ 2));
    }
}
exports.Vector = Vector;
