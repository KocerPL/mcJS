import { Model, rot2d } from "../Game/Models.js";
import { CanvaManager } from "./CanvaManager.js";
import { RenderSet } from "./RenderSet.js";
import { Vector } from "./Utils/Vector.js";
import {Main} from "../Main.js";
const gl = CanvaManager.gl;
export class Loader
{
    public static txtFile(path:string)
    {
        const req = new  XMLHttpRequest;
        req.open("GET", path, false);
        req.send(null);
        return req.responseText;
    }
    public static image(path:string):WebGLTexture
    {
        const img =  new Image();
        img.src = path;
        img.decode();
        //loading image ^
        //Buffering image
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.activeTexture(gl.TEXTURE0);
        img.onload = ()=>{
            gl.bindTexture(gl.TEXTURE_2D,texture);  
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA,gl.UNSIGNED_BYTE,img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
        };
        if(img.complete)
        {
            img.onload(new Event("loaded"));
        }




        return texture;
    }
    public static imageArray(path:string,count:number,size:number):WebGLTexture
    {
        const img =  new Image();
        img.src = path;
        img.decode();
      
        //loading image ^
        //Buffering image
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D_ARRAY,texture);
        gl.activeTexture(gl.TEXTURE0);
        img.onload = ()=>{
            const testCanv = document.createElement("canvas");
            testCanv.width=img.width;
            testCanv.height=img.height;
            const ctx =testCanv.getContext("2d",{willReadFrequently:true});
            ctx.clearRect(0,0,img.width,img.height);
            ctx.drawImage(img,0,0,img.width,img.height);
            // 
        
            gl.bindTexture(gl.TEXTURE_2D_ARRAY,texture);  
            //  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA,gl.UNSIGNED_BYTE,img);
            gl.texImage3D(gl.TEXTURE_2D_ARRAY,0,gl.RGBA8,size,size,count,0,gl.RGBA,gl.UNSIGNED_BYTE,img);
            const pos= new Vector(0,0,0);
            for(let i=0;i<count;i++)
            {
                const buff = ctx.getImageData(pos.x,pos.y,size,size).data;
                gl.texSubImage3D(gl.TEXTURE_2D_ARRAY,0,0,0,pos.z,size,size,1,gl.RGBA,gl.UNSIGNED_BYTE,buff);
                pos.x+=size;
                if(pos.x>img.width)
                {
                    pos.x=0;
                    pos.y+=size;
                }
                pos.z++;
            }
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            //   gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
        };
        if(img.complete)
        {
            img.onload(new Event("loaded"));
        }




        return texture;
    }
    public static  imageArrayByJSON(path:string,json)
    {
        const img =  new Image();
        img.src = path;
        img.decode();
    
        //loading image ^
        //Buffering image
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D_ARRAY,texture);
        gl.activeTexture(gl.TEXTURE0);
        img.onload = ()=>{
            const testCanv = document.createElement("canvas");
            testCanv.width=img.width;
            testCanv.height=img.height;
            const ctx =testCanv.getContext("2d",{willReadFrequently:true});
            ctx.clearRect(0,0,img.width,img.height);
            ctx.drawImage(img,0,0,img.width,img.height);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY,texture);  
            gl.texImage3D(gl.TEXTURE_2D_ARRAY,0,gl.RGBA8,json[0].size[0],json[0].size[1],json.length,0,gl.RGBA,gl.UNSIGNED_BYTE,img);
            const pos= new Vector(0,0,0);
            for(let i=0;i<json.length;i++)
            {
                const sizeX = json[i].size[0];
                const sizeY =  json[i].size[1];
                pos.x = json[i].pos[0];
                pos.y = json[i].pos[1];
                const buff = ctx.getImageData(pos.x,pos.y,sizeX,sizeY).data;
                gl.texSubImage3D(gl.TEXTURE_2D_ARRAY,0,0,0,pos.z,sizeX,sizeY,1,gl.RGBA,gl.UNSIGNED_BYTE,buff);
                pos.z++;
            }
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
            console.log("loaded json");
           
        };
        if(img.complete)
        {
            img.onload(new Event("loaded"));
        }




        return texture;
    }
    public static  imageAtlasByJSON(path:string,json:Array<{pos:Array<number>,size:Array<number>,rotation?}>,imgSizeX:number,imgSizeY:number):Texture2
    {
        const img =  new Image();
        img.src = path;
        img.decode();
            
        //loading image ^
        //Buffering image
        const texture = gl.createTexture();
        const coords:Array<{x:number,dx:number,y:number,dy:number,rotation:rot2d }> = [];
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.activeTexture(gl.TEXTURE0);
        for(let x=0; x<json.length; x++)
        {
            coords.push({
                x:(json[x].pos[0]+0.1)/imgSizeX,
                y:(json[x].pos[1]+0.1)/imgSizeY,
                dx:((json[x].pos[0] +json[x].size[0])-0.1)/imgSizeX,
                dy:((json[x].pos[1] +json[x].size[1])-0.1)/imgSizeY,
                rotation:json[x].rotation
            });
            
        }
        img.onload = ()=>{
            gl.bindTexture(gl.TEXTURE_2D,texture);  
            gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,img.width,img.height,0,gl.RGBA,gl.UNSIGNED_BYTE,img);
    
      
    
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            console.log("loaded json");
          
        };
        if(img.complete)
        {
            img.onload(new Event("loaded"));
        }


        const textureHolder = new Texture2(coords,texture);

        return textureHolder;
    }
    static fontAtlas(fontName:string):Texture2
    {
        const coords:Array<{x:number,dx:number,y:number,dy:number,rotation:rot2d }> = [];
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 128*32;
        canvas.height =32;
        // Prepare the font to be able to measure
        const fontSize =  16;
    
        // Resize canvas to match text size 
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";
    
        // Re-apply font since canvas is resized.
        ctx.font = `${fontSize}px `+fontName;
        ctx.textAlign = "center" ;
        ctx.textBaseline ="middle";
    
        // Make the canvas transparent for simplicity
        ctx.fillStyle = "transparent";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
        ctx.fillStyle = "white";
        for(let i =0;i<128;i++)
        {
           
            ctx.fillText(String.fromCharCode(i),16+(i*32),16,32);
            const coord:{x:number,dx:number,y:number,dy:number,rotation:rot2d }={
                x:(i*32)/canvas.width,
                y:0,
                dx:(32+(i*32))/canvas.width,
                dy:1,
                rotation:null
            };
            coords.push(coord);
        }

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.activeTexture(gl.TEXTURE0); 
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,canvas.width,canvas.height,0,gl.RGBA,gl.UNSIGNED_BYTE,canvas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        //document.body.appendChild(canvas);
        return new Texture2(coords,texture);
    }
    public static loadObj(path:string):RenderSet
    {
        const text =  this.txtFile(path);
        const rs:RenderSet = new RenderSet(Main.atlasShader);
        const textureCoords:Array<number> = [];
        let i=0;
        while(i<text.length)
        {
            let fp:number;
            let num:number;
            if(text[i]=="\n")
            {
                i++;
                switch(text[i])
                {
                case "v":
                    i++;
                    switch(text[i])
                    {
                    case " ":
                        for(let k=0;k<3;k++)
                        {
                            i++;
                            fp= i;
                            while(text[i]!=" " && text[i]!="\n")
                            {
                                i++;
                            }
                            num =  Number.parseFloat(text.slice(fp,i));
                            rs.vertices.push(num);
                        }
                        break;
                    case "t":
                        for(let k=0;k<2;k++)
                        {
                            i++;
                            fp= i;
                            while(text[i]!=" " && text[i]!="\n")
                            {
                                i++;
                            }
                            num =  Number.parseFloat(text.slice(fp,i));
                            textureCoords.push(num);
                        }
                    }
                    break;
                case "f":
                    i++;
                    for(let k=0;k<3;k++)
                    {
                        i++;
                        fp = i;
                        while(text[i]!="/")
                        {
                            i++;
                        }
                        num =  Number.parseFloat(text.slice(fp,i));
                        rs.indices.push(num-1);
                        i++;
                        fp = i;
                        while(text[i]!="/")
                        {
                            i++;
                        }
                        num =  Number.parseFloat(text.slice(fp,i));
                        rs.textureCoords.push(textureCoords[(num-1)*2],textureCoords[((num-1)*2)+1],0);
                        while(text[i]!=" " && text[i]!="\n")
                        {
                            i++;
                        }
                    }
                    break;
                }
            }
            else 
                i++;
           
        }
        for(let i=0;i<rs.vertices.length;i++)
        {
            rs.skyLight.push(15);
            rs.blockLight.push(15);
            //rs.textureCoords.push(0);
        }
        rs.bufferArrays();
        return rs;
    }
    public static json(path:string)
    {
        
        const req = new  XMLHttpRequest;
        req.open("GET", path, false);
        req.send(null);
        return JSON.parse(req.responseText);
        
    }
}
export class Texture2
{
    x:number;
    y:number;
    dx:number;
    coords:Array<{x:number,dx:number,y:number,dy:number,rotation:rot2d }>;
    dy:number;
    ID:WebGLTexture;
    constructor(coords:Array<{x:number,dx:number,y:number,dy:number,rotation:rot2d }>, textureID:WebGLTexture)
    {  
        this.ID=textureID;
        this.coords =coords;
     
    }
    public bind()
    {
        gl.bindTexture(gl.TEXTURE_2D,this.ID);
    }
}