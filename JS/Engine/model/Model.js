import { Loader } from "../Loader.js";
import { Matrix } from "../Utils/Matrix.js";
export class Model
{
    constructor(gl,vertices,colors,indices)
    {
        this.raw = Loader.loadToVao(gl,vertices,indices); 
        
        this.transformation = new Matrix();
    }
}