export class SubChunk {
    pos;
    blocks = new Array(); // x = %16 y = /16 z= /256
    lightMap = new Array();
    constructor(pos) {
        this.pos = pos;
    }
}
