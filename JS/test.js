import { Main } from "./Main";
onmessage = (ev) => {
    if (ev.data.task == "Subchunk") {
        let rand = 0;
        Main.test.subchunks[rand].blocks[Math.floor(Math.random() * 16)][Math.floor(Math.random() * 16)][Math.floor(Math.random() * 16)] = Math.ceil(Math.random() * 2);
        Main.test.subchunks[rand].updateVerticesIndices();
        postMessage("okok");
    }
    postMessage("fkfk");
};
postMessage("okoko");
