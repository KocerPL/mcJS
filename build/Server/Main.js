import { SubChunk } from "./WorldBuilder/SubChunk.js";
addEventListener('message', e => {
    let sub = new SubChunk();
    if (e.data == "start")
        Main.run();
});
var settings = {
    maxChunks: 120
};
class Main {
    static run() {
        postMessage({ type: "console", msg: "Starting server in separate thread!!" });
    }
}
