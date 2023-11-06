"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUUID = void 0;
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const Generator_1 = require("./World/Generator");
const Utils_1 = require("./Utils");
const NetworkHandler_1 = require("./NetworkHandler");
const Item_1 = require("./Entities/Item");
const World_1 = require("./World/World");
let lastID = 0;
let counter = 0;
const world = new World_1.World(__dirname);
const app = express();
const gen = new Generator_1.Generator();
const server = http.createServer(app);
const io = new Server(server);
const netHandler = new NetworkHandler_1.NetworkHandler(io);
function getUUID() {
    return Number.parseInt(Date.now().toString() + (counter++).toString());
}
exports.getUUID = getUUID;
class PlayerInfo {
    inventory = new Array(27);
    itemsBar = new Array(9);
    constructor() {
        for (let i = 0; i < this.inventory.length; i++)
            this.inventory[i] = { id: Math.floor((0, Utils_1.randRange)(0, 11)), count: 64 };
        for (let i = 0; i < this.itemsBar.length; i++)
            this.itemsBar[i] = { id: 0, count: 0 };
    }
}
const loadedChunks = new Map();
const entities = [];
let playersInfo = JSON.parse(fs.readFileSync(__dirname + "/players.json").toString());
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
    //console.log('a user connected');
    socket.KOCEid = lastID++;
    socket.pos = { x: 0, y: 200, z: 0 };
    socket.on("login", (loginObject) => {
        socket.nick = loginObject.nick;
        console.log(loginObject.nick + " logged in");
        socket.emit('login', { x: 0, y: 200, z: 0 }, socket.KOCEid);
        // console.log(io.sockets);
        if (!(socket.nick in playersInfo)) {
            playersInfo[socket.nick] = new PlayerInfo();
            savePlayerInfo();
        }
        let inventory = playersInfo[socket.nick].inventory;
        for (let i = 0; i < inventory.length; i++) {
            socket.emit('updateItem', { id: inventory[i].id, count: inventory[i].count, slot: i, inventory: true });
        }
        let itemsBar = playersInfo[socket.nick].itemsBar;
        for (let i = 0; i < itemsBar.length; i++) {
            socket.emit('updateItem', { id: itemsBar[i].id, count: itemsBar[i].count, slot: i, inventory: false });
        }
        for (let sock of io.sockets.sockets) {
            if (sock[1] != socket) {
                // console.log(sock[1]);
                socket.emit('spawnPlayer', sock[1].pos, sock[1].KOCEid);
            }
        }
        socket.broadcast.emit('spawnPlayer', socket.pos, socket.KOCEid);
    });
    socket.on('moveItem', (data) => {
        //  console.log("Moving....");
        console.log(data);
        if (data.isInv1 && data.isInv2) {
            //    console.log("Moved item!!");
            let item = playersInfo[socket.nick].inventory[data.slot1];
            playersInfo[socket.nick].inventory[data.slot1] = playersInfo[socket.nick].inventory[data.slot2];
            playersInfo[socket.nick].inventory[data.slot2] = item;
            socket.emit("updateItem", { id: playersInfo[socket.nick].inventory[data.slot2].id, count: playersInfo[socket.nick].inventory[data.slot2].count, slot: data.slot2, inventory: true });
            socket.emit("updateItem", { id: playersInfo[socket.nick].inventory[data.slot1].id, count: playersInfo[socket.nick].inventory[data.slot1].count, slot: data.slot1, inventory: true });
        }
        else if (data.isInv1 && !data.isInv2) {
            let item = playersInfo[socket.nick].inventory[data.slot1];
            playersInfo[socket.nick].inventory[data.slot1] = playersInfo[socket.nick].itemsBar[data.slot2];
            playersInfo[socket.nick].itemsBar[data.slot2] = item;
            socket.emit("updateItem", { id: playersInfo[socket.nick].itemsBar[data.slot2].id, count: playersInfo[socket.nick].itemsBar[data.slot2].count, slot: data.slot2, inventory: false });
            socket.emit("updateItem", { id: playersInfo[socket.nick].inventory[data.slot1].id, count: playersInfo[socket.nick].inventory[data.slot1].count, slot: data.slot1, inventory: true });
        }
        else if (!data.isInv1 && data.isInv2) {
            let item = playersInfo[socket.nick].inventory[data.slot2];
            playersInfo[socket.nick].inventory[data.slot2] = playersInfo[socket.nick].itemsBar[data.slot1];
            playersInfo[socket.nick].itemsBar[data.slot1] = item;
            socket.emit("updateItem", { id: playersInfo[socket.nick].itemsBar[data.slot1].id, count: playersInfo[socket.nick].itemsBar[data.slot1].count, slot: data.slot1, inventory: false });
            socket.emit("updateItem", { id: playersInfo[socket.nick].inventory[data.slot2].id, count: playersInfo[socket.nick].inventory[data.slot2].count, slot: data.slot2, inventory: true });
        }
        else if (!data.isInv1 && !data.isInv2) {
            let item = playersInfo[socket.nick].itemsBar[data.slot2];
            playersInfo[socket.nick].itemsBar[data.slot2] = playersInfo[socket.nick].itemsBar[data.slot1];
            playersInfo[socket.nick].itemsBar[data.slot1] = item;
            socket.emit("updateItem", { id: playersInfo[socket.nick].itemsBar[data.slot1].id, count: playersInfo[socket.nick].itemsBar[data.slot1].count, slot: data.slot1, inventory: false });
            socket.emit("updateItem", { id: playersInfo[socket.nick].itemsBar[data.slot2].id, count: playersInfo[socket.nick].itemsBar[data.slot2].count, slot: data.slot2, inventory: false });
        }
        savePlayerInfo();
    });
    socket.on('getSubchunk', (x, y, z) => {
        // console.log("Subchunk");
        const chunk = world.getChunk(x, z);
        for (let ent of chunk.entities)
            if ((ent.pos.y / 16) > y && (ent.pos.y / 16) < y + 1) {
                socket.emit("spawnEntity", { type: ent.type, id: ent instanceof Item_1.Item ? ent.id : 2, pos: ent.pos, uuid: ent.uuid });
                entities.push(ent);
                console.log("ent");
            }
        let data = chunk.subchunks[y];
        socket.emit('subchunk', { data: { subX: x, subY: y, subZ: z, blocks: data } });
    });
    socket.on("playerMove", (pos, rot) => {
        socket.pos = pos;
        socket.rot = rot;
        socket.broadcast.emit("moveEntity", socket.KOCEid, pos, rot);
    });
    socket.on("placeBlock", (data) => {
        if (data.id != 0 && playersInfo[socket.nick].itemsBar[data.slot].id != data.id)
            return;
        if (--playersInfo[socket.nick].itemsBar[data.slot].count <= 0) {
            playersInfo[socket.nick].itemsBar[data.slot].id = 0;
            playersInfo[socket.nick].itemsBar[data.slot].count = 0;
        }
        if (data.id != 0)
            socket.emit("updateItem", { id: playersInfo[socket.nick].itemsBar[data.slot].id, count: playersInfo[socket.nick].itemsBar[data.slot].count, slot: data.slot, inventory: false });
        savePlayerInfo();
        io.emit("placeBlock", data);
        let inPos = { x: Math.round(Math.round(data.pos.x) % 16), y: Math.round(Math.round(data.pos.y) % 16), z: Math.round(Math.round(data.pos.z) % 16) };
        if (inPos.x < 0)
            inPos.x = 16 - Math.abs(inPos.x);
        if (inPos.z < 0)
            inPos.z = 16 - Math.abs(inPos.z);
        if (inPos.y < 0)
            inPos.y = 16 - Math.abs(inPos.y);
        const subchunkPos = { x: Math.floor(Math.round(data.pos.x) / 16), y: Math.floor(Math.round(data.pos.y) / 16), z: Math.floor(Math.round(data.pos.z) / 16) };
        let chunk = world.getChunk(subchunkPos.x, subchunkPos.z);
        console.log(subchunkPos.x, subchunkPos.y, subchunkPos.z);
        if (data.id == 0) {
            socket.emit("spawnEntity", { type: "item", id: chunk.subchunks[subchunkPos.y][World_1.World.toSubIndex(inPos.x, inPos.y, inPos.z)], pos: data.pos });
            chunk.entities.push(new Item_1.Item(data.pos, chunk.subchunks[subchunkPos.y][World_1.World.toSubIndex(inPos.x, inPos.y, inPos.z)]));
        }
        //  let fdata = JSON.parse(fs.readFileSync(__dirname+"/world/"+subchunkPos.x+"."+subchunkPos.y+"."+subchunkPos.z+".sub").toString());
        chunk.subchunks[subchunkPos.y][World_1.World.toSubIndex(inPos.x, inPos.y, inPos.z)] = data.id;
        world.saveChunk(chunk);
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
function savePlayerInfo() {
    fs.writeFileSync(__dirname + "/players.json", JSON.stringify(playersInfo));
}
setInterval(() => {
    update();
}, 1000);
function update() {
    for (const ent of entities) {
        ent.pos.y += 0.1;
        io.emit("updateEntity", { uuid: ent.uuid, pos: ent.pos });
    }
}
