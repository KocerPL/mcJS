"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Array3D = void 0;
class Array3D extends Array {
    constructor(x, y, z) {
        super(x);
        for (let i = 0; i < x; i++) {
            this[i] = new Array(y);
            for (let j = 0; j < y; j++) {
                this[i][j] = new Array(z);
            }
        }
    }
}
exports.Array3D = Array3D;
