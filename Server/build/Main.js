"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIndex = void 0;
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const Chunk_1 = require("./World/Chunk");
const Generator_1 = require("./World/Generator");
let lastID = 0;
const app = express();
const gen = new Generator_1.Generator();
const server = http.createServer(app);
const io = new Server(server);
const loadedChunks = new Map();
let pos = __dirname.length - 1;
for (let i = 0; i < 2; pos--) {
    if (__dirname.at(pos) == "/")
        i++;
}
const rDir = __dirname.substring(0, pos + 1);
app.get("/", (req, res) => {
    res.sendFile(rDir + "/Client/index.html");
});
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.KOCEid = lastID++;
    socket.pos = { x: 0, y: 200, z: 0 };
    setTimeout(() => {
        socket.emit('login', JSON.stringify({ x: 0, y: 200, z: 0 }), socket.KOCEid);
        // console.log(io.sockets);
        for (let i = 0; i < 10; i++)
            socket.emit('addItem', { id: i + 1, count: 64, slot: i, inventory: true });
        for (let sock of io.sockets.sockets) {
            if (sock[1] != socket) {
                // console.log(sock[1]);
                socket.emit('spawnPlayer', sock[1].pos, sock[1].KOCEid);
            }
        }
        socket.broadcast.emit('spawnPlayer', socket.pos, socket.KOCEid);
    }, 2000);
    socket.on('getSubchunk', (x, y, z) => {
        // console.log("Subchunk");
        const chunk = getChunk(x, z);
        let data = chunk.subchunks[y];
        socket.emit('subchunk', { data: { subX: x, subY: y, subZ: z, blocks: data } });
    });
    socket.on("playerMove", (pos, rot) => {
        socket.pos = pos;
        socket.rot = rot;
        socket.broadcast.emit("moveEntity", socket.KOCEid, pos, rot);
    });
    socket.on("placeBlock", (data) => {
        socket.broadcast.emit("placeBlock", data);
        let inPos = { x: Math.round(Math.round(data.pos.x) % 16), y: Math.round(Math.round(data.pos.y) % 16), z: Math.round(Math.round(data.pos.z) % 16) };
        if (inPos.x < 0)
            inPos.x = 16 - Math.abs(inPos.x);
        if (inPos.z < 0)
            inPos.z = 16 - Math.abs(inPos.z);
        if (inPos.y < 0)
            inPos.y = 16 - Math.abs(inPos.y);
        const subchunkPos = { x: Math.floor(Math.round(data.pos.x) / 16), y: Math.floor(Math.round(data.pos.y) / 16), z: Math.floor(Math.round(data.pos.z) / 16) };
        let chunk = getChunk(subchunkPos.x, subchunkPos.z);
        console.log(subchunkPos.x, subchunkPos.y, subchunkPos.z);
        //  let fdata = JSON.parse(fs.readFileSync(__dirname+"/world/"+subchunkPos.x+"."+subchunkPos.y+"."+subchunkPos.z+".sub").toString());
        chunk.subchunks[subchunkPos.y][toIndex(inPos.x, inPos.y, inPos.z)] = data.id;
        saveChunk(chunk);
    });
    socket.on("disconnect", (reason) => {
        socket.broadcast.emit("killEntity", socket.KOCEid);
    });
});
app.get("*", (req, res) => {
    //  console.log(rDir+"/Client/index.html");
    if (req.path.includes("favicon")) {
        console.log("FAVICON");
        res.sendFile(rDir + "/Client/res/favicon.ico");
        return;
    }
    res.sendFile(rDir + "/Client" + req.path);
});
server.listen(3000, () => {
    console.log("listening on 3000");
});
function saveChunk(chunk) {
    fs.writeFileSync(__dirname + "/world/" + chunk.pos[0] + "." + chunk.pos[1] + ".kChunk", JSON.stringify(chunk.subchunks));
}
function getChunk(x, z) {
    if (loadedChunks.has(x + "-" + z))
        return loadedChunks.get(x + "-" + z);
    if (fs.existsSync(__dirname + "/world/" + x + "." + z + ".kChunk")) {
        let chunk = new Chunk_1.Chunk();
        chunk.subchunks = JSON.parse(fs.readFileSync(__dirname + "/world/" + x + "." + z + ".kChunk").toString());
        chunk.pos = [x, z];
        loadedChunks.set(x + "-" + z, chunk);
        return chunk;
    }
    def: {
        let chunk = gen.generate(x, z);
        loadedChunks.set(x + "-" + z, chunk);
        return chunk;
    }
}
function genSubchunk(n) {
    let k = new Array(4096);
    for (let i = 0; i < 4096; i++) {
        k[i] = n;
    }
    return k;
}
function toIndex(x, y, z) {
    return x + (y * 16) + (z * 256);
}
exports.toIndex = toIndex;
