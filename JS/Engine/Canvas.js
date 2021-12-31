import { Shader } from "./Shader/Shader.js";

export class Canvas
{
    constructor(location)
    {
        this.canva = document.createElement("canvas");
        this.ratio = 1920/1080;
        this.gl = this.canva.getContext("webgl2");
        let gl = this.gl;
        if (this.gl === null) 
            throw new Error("Your browser doesn't support webgl, or you have no graphics driver updated!");
        location.appendChild(this.canva);
        this.resize();
        this.shader = new Shader("JS/Engine/Shader/default.vert","JS/Engine/Shader/default.frag",gl);
        window.addEventListener('resize',this.resize.bind(this),false);
    }
    resize()
    {  this.min = window.innerWidth/this.ratio<window.innerHeight;
        this.canva.height= this.min?window.innerWidth/this.ratio: window.innerHeight;
        this.canva.width = this.min?window.innerWidth: window.innerHeight*this.ratio;
        let gl = this.gl;
      gl.viewport(0,0,this.canva.width,this.canva.height);
    }
}