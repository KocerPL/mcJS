export class Vector {
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
}
