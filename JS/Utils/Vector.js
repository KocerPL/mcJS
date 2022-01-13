var Vector = /** @class */ (function () {
    function Vector(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w !== null && w !== void 0 ? w : 1;
    }
    return Vector;
}());
export { Vector };
