"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkHandler = void 0;
class NetworkHandler {
    io;
    constructor(io) {
        this.io = io;
    }
    register(handler) {
        this.io.on(handler.trigger, (ev) => {
            handler.handle(ev);
        });
    }
}
exports.NetworkHandler = NetworkHandler;
