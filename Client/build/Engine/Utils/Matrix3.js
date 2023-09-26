import { Vector3 } from "./Vector3.js";
export class Matrix3 {
    _data = new Array(9);
    static identity() {
        let mat = new Matrix3();
        mat._data = [1, 0, 0,
            0, 1, 0,
            0, 0, 1];
        return mat;
    }
    multiplyMat(mat) {
        let outMat = new Matrix3();
        outMat._data[0] = this.dot(this._data[0], this._data[1], this._data[2], mat._data[0], mat._data[3], mat._data[6]);
        outMat._data[1] = this.dot(this._data[0], this._data[1], this._data[2], mat._data[1], mat._data[4], mat._data[7]);
        outMat._data[2] = this.dot(this._data[0], this._data[1], this._data[2], mat._data[2], mat._data[5], mat._data[8]);
        outMat._data[3] = this.dot(this._data[3], this._data[4], this._data[5], mat._data[0], mat._data[3], mat._data[6]);
        outMat._data[4] = this.dot(this._data[3], this._data[4], this._data[5], mat._data[1], mat._data[4], mat._data[7]);
        outMat._data[5] = this.dot(this._data[3], this._data[4], this._data[5], mat._data[2], mat._data[5], mat._data[8]);
        outMat._data[6] = this.dot(this._data[6], this._data[7], this._data[8], mat._data[0], mat._data[3], mat._data[6]);
        outMat._data[7] = this.dot(this._data[6], this._data[7], this._data[8], mat._data[1], mat._data[4], mat._data[7]);
        outMat._data[8] = this.dot(this._data[6], this._data[7], this._data[8], mat._data[2], mat._data[5], mat._data[8]);
        return outMat;
    }
    multiplyVec(vec) {
        let outVec;
        let col1 = new Vector3(this._data[0], this._data[3], this._data[6]);
        let col2 = new Vector3(this._data[1], this._data[4], this._data[7]);
        let col3 = new Vector3(this._data[2], this._data[5], this._data[8]);
        col1 = col1.multiply(vec.x);
        col2 = col2.multiply(vec.y);
        col3 = col3.multiply(vec.z);
        outVec = col1.add(col2).add(col3);
        return outVec;
    }
    translate(x, y) {
        const transl = Matrix3.identity();
        transl._data[2] = x;
        transl._data[5] = y;
        return this.multiplyMat(transl);
    }
    scale(x, y) {
        const scale = new Matrix3;
        scale._data = [x, 0, 0,
            0, y, 0,
            0, 0, 1];
        return this.multiplyMat(scale);
    }
    dot(a1, a2, a3, b1, b2, b3) {
        return (a1 * b1) + (a2 * b2) + (a3 * b3);
    }
    toFloat32Array() {
        return new Float32Array(this._data);
    }
    inverse() {
        let a = 1 / this.det();
        let mat = new Matrix3();
        mat._data[0] = det2(this._data[4], this._data[5], this._data[7], this._data[8]) * a;
        mat._data[1] = det2(this._data[2], this._data[1], this._data[8], this._data[7]) * a;
        mat._data[2] = det2(this._data[1], this._data[2], this._data[4], this._data[5]) * a;
        mat._data[3] = det2(this._data[5], this._data[3], this._data[8], this._data[6]) * a;
        mat._data[4] = det2(this._data[0], this._data[2], this._data[6], this._data[8]) * a;
        mat._data[5] = det2(this._data[2], this._data[0], this._data[5], this._data[3]) * a;
        mat._data[6] = det2(this._data[3], this._data[4], this._data[6], this._data[7]) * a;
        mat._data[7] = det2(this._data[1], this._data[0], this._data[7], this._data[6]) * a;
        mat._data[8] = det2(this._data[0], this._data[1], this._data[3], this._data[4]) * a;
        return mat;
    }
    det() {
        return (this._data[0] * det2(this._data[4], this._data[5], this._data[7], this._data[8])) -
            (this._data[1] * det2(this._data[3], this._data[5], this._data[6], this._data[8])) +
            (this._data[2] * det2(this._data[3], this._data[4], this._data[6], this._data[7]));
    }
    rotate(rad) {
        let rot = new Matrix3();
        rot._data[0] = Math.cos(rad);
        rot._data[1] = -Math.sin(rad);
        rot._data[2] = 0;
        rot._data[3] = Math.sin(rad);
        rot._data[4] = Math.cos(rad);
        rot._data[5] = 0;
        rot._data[6] = 0;
        rot._data[7] = 0;
        rot._data[8] = 1;
        return this.multiplyMat(rot);
    }
}
function det2(a11, a12, a21, a22) {
    return (a11 * a22) - (a12 * a21);
}
