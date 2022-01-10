import { Shader } from "./Shader.js";

export class TextureShader extends Shader
{
    constructor(gl)
    {
        super("/JS/Engine/Shader/texture.vert","/JS/Engine/Shader/texture.frag",gl);
    }
    loadUniforms(transformationMatrix,projectionMatrix,viewMatrix)
    {
        let transf = this.getUniform('transformation');
        this.loadMatrix(transf,transformationMatrix);
        let proj = this.getUniform('projection');
        this.loadMatrix(proj,projectionMatrix);
        let vm = this.getUniform('view');
        this.loadMatrix(vm,viewMatrix);
    }
}