import { Matrix } from "./Utils/Matrix.js";

export class RawModel
{
    constructor(vao,vertexCount)
    {
this.vao = vao;
this.vertexCount = vertexCount;
this.transformation = new Matrix();
    }
}