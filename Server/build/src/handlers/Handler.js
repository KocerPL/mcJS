"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
class Handler {
    constructor(netHandler, trigger) {
        this.trigger = trigger;
        netHandler.register(this);
    }
    trigger;
}
exports.Handler = Handler;
