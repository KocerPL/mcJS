export class Loader {
    static txtFile(path) {
        let req = new XMLHttpRequest;
        req.open('GET', path, false);
        req.send(null);
        return req.responseText;
    }
}
