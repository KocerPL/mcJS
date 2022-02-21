import { CanvaManager } from "../Engine/CanvaManager.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { Main } from "../Main.js";
import { SubChunk } from "./SubChunk.js"
let gl = CanvaManager.gl;
export class Chunk {
  subchunks: Array<SubChunk> = new Array(16);
  todo: Array<Function> = new Array();
  constructor(x, z) {
    // console.log("Constructing chunk");
    for (let i = 0; i < this.subchunks.length; i++) {
      this.todo.push(() => { this.subchunks[i] = new SubChunk(new Vector(x, i, z)); });
      //console.log("Completed generating subchunk: "+i);
    }
    // console.log("done constructing");
  }
  update(startTime: number) {
    let actualTime = Date.now();

    while (this.todo.length > 0 && actualTime - 200 < startTime) {
      actualTime = Date.now();
      //console.log(actualTime);
      let work = this.todo.shift();
      work();
    }
    for (let i = 0; i < this.subchunks.length; i++) {
      if (this.subchunks[i] != undefined)
        this.subchunks[i].update(startTime);
    }
  }
  render() {
    for (let i = 0; i < this.subchunks.length; i++) {
      if (this.subchunks[i] != undefined && this.subchunks[i].generated) {
        this.subchunks[i].vao.bind();
        Main.shader.loadUniforms(Main.player.camera.getProjection(), this.subchunks[i].transformation, Main.player.camera.getView());
        gl.drawElements(gl.TRIANGLES, this.subchunks[i].indices.length, gl.UNSIGNED_INT, 0);
      }
    }
  }
  getBlock(pos) {
    if (pos.x < 0 || pos.y < 0 || pos.z < 0 || pos.x > 16 || pos.y > 256 || pos.z > 256) {
      throw new Error("Incorrect cordinates");
    }
    let y = pos.y%16;
    let yPos = Math.round(pos.y/16);
    if(this.subchunks[yPos]!=undefined)
    {
    return this.subchunks[yPos].blocks[pos.x][y][pos.z];
    }
  }
  setBlock(pos:Vector, blockID) {
    if (pos.x < 0 || pos.y < 0 || pos.z < 0 || pos.x > 16 || pos.y > 256 || pos.z > 256) {
      throw new Error("Incorrect cordinates");
    }
    let y = pos.y%16;
  
    let yPos = Math.round(pos.y/16);
    
    if(this.subchunks[yPos]!=undefined)
    {
    this.subchunks[yPos].blocks[pos.x][y][pos.z]=blockID;
    this.subchunks[yPos].updateVerticesIndices();
    }
  }

}