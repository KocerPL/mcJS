"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const World_1 = require("./World");
const Utils_1 = require("../Utils");
const Chunk_1 = require("./Chunk");
class Generator {
    WorldSeed = 141425;
    generate(x1, z1) {
        let chunk = new Chunk_1.Chunk();
        chunk.pos = new Array(2);
        chunk.pos[0] = x1;
        chunk.pos[1] = z1;
        chunk.subchunks = new Array(16);
        for (let i = 0; i < 16; i++) {
            let sub = new Array(4096);
            for (let x = 0; x < 16; x++)
                for (let z = 0; z < 16; z++) {
                    let height = 50 + Math.floor(perlin(this.WorldSeed, (x + (x1 * 16)) / 256, (z + (z1 * 16)) / 256, 200));
                    let randomAdditive = (0, Utils_1.randRange)(-3, 3);
                    //  console.log(height);
                    for (let y = 0; y < 16; y++) {
                        if (y + (i * 16) <= height && y + (i * 16) > 175 + randomAdditive)
                            sub[World_1.World.toSubIndex(x, y, z)] = 3;
                        else if (y + (i * 16) == height)
                            sub[World_1.World.toSubIndex(x, y, z)] = 2;
                        else if (y + (i * 16) < height && y + (i * 16) > height - 4)
                            sub[World_1.World.toSubIndex(x, y, z)] = 1;
                        else if (y + (i * 16) < height)
                            sub[World_1.World.toSubIndex(x, y, z)] = 3;
                        else
                            sub[World_1.World.toSubIndex(x, y, z)] = 0;
                    }
                }
            chunk.subchunks[i] = sub;
        }
        return chunk;
    }
}
exports.Generator = Generator;
function PRNG(seed, x, y) {
    seed = seed % 2147483647;
    if (seed <= 0) {
        seed += 2147483646;
    }
    let random = (seed * 16807 + x * 1234 + y * 4321) % 2147483647;
    return (random - 1) / 2147483646;
}
function perlin(seed, x, y, maxHeight) {
    const X = Math.floor(x);
    const Y = Math.floor(y);
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const valueTopRight = (PRNG(seed, X + 1, Y + 1) * 100000000) % maxHeight;
    const valueTopLeft = (PRNG(seed, X, Y + 1) * 100000000) % maxHeight;
    const valueBottomRight = (PRNG(seed, X + 1, Y) * 100000000) % maxHeight;
    const valueBottomLeft = (PRNG(seed, X, Y) * 100000000) % maxHeight;
    const u = Fade(xf);
    const v = Fade(yf);
    const result = Lerp(u, Lerp(v, valueBottomLeft, valueTopLeft), Lerp(v, valueBottomRight, valueTopRight));
    return result;
}
function Fade(t) {
    return ((6 * t - 15) * t + 10) * t * t * t;
}
function Lerp(t, a1, a2) {
    return a1 + t * (a2 - a1);
}
