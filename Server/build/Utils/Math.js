"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = exports.randRange = void 0;
function randRange(min, max) {
    return (Math.random() * (max - min)) + min;
}
exports.randRange = randRange;
function clamp(num, min, max) {
    return Math.max(Math.min(num, max), min);
}
exports.clamp = clamp;
