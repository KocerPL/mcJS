export class Loader {
    static txtFile(path) {
        let req = new XMLHttpRequest;
        req.open('GET', path, false);
        req.send(null);
        return req.responseText;
    }
    static image(path) {
        let img = new Image();
        img.src = path;
        return img;
    }
}
