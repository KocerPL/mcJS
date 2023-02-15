this.importScripts();
this.onmessage = (ev) => {
    this.postMessage("test");
    this.close();
};
