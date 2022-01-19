export class Loader
{
    public static txtFile(path:string)
    {
        let req = new  XMLHttpRequest;
        req.open('GET', path, false);
        req.send(null);
     return req.responseText;
    }
    public static image(path:string) :HTMLImageElement
    {
        let img =  new Image();
        img.src = path;
       img.decode();
        return img;
    }
}