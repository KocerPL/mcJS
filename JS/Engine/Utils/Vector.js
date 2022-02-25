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
}
