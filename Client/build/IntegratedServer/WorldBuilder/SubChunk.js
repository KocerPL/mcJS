export class SubChunk {
    pos;
    blocks = []; // x = %16 y = /16 z= /256
    lightMap = [];
    constructor(pos) {
        this.pos = pos;
    }
}
