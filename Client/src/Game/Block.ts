import { Texture } from "../Engine/Texture.js";
import { Vector4 } from "../Engine/Utils/Vector4.js";
export enum blockType
{
    FULL,
    NOTFULL,
    EMPTY
}

export class Block
{
   
    id:number;
    lightFBlock=0;
    skyLight=0;
    constructor(id)
    {
        this.id = id;
    }
    static createInfoArray()
    {
        Block.info = 
          [{//0
              name:"Air",
              type:blockType.EMPTY
          },
          {//1
              name:"Dirt",
              type:blockType.FULL,
              textureIndex:[
                  Texture.testAtkas.indexMap.get("dirt"),
                  Texture.testAtkas.indexMap.get("dirt"),
                  Texture.testAtkas.indexMap.get("dirt"),
                  Texture.testAtkas.indexMap.get("dirt"),
                  Texture.testAtkas.indexMap.get("dirt"),
                  Texture.testAtkas.indexMap.get("dirt")
              ],
              breakTime:2
          },
          {//2
              name:"Grass",
              type:blockType.FULL,
              textureIndex:[
                  Texture.testAtkas.indexMap.get("grassTop"),
                  Texture.testAtkas.indexMap.get("dirt"),
                  Texture.testAtkas.indexMap.get("grassSide"),
                  Texture.testAtkas.indexMap.get("grassSide"),
                  Texture.testAtkas.indexMap.get("grassSide"),
                  Texture.testAtkas.indexMap.get("grassSide")
              ],
              breakTime:2
          },
          {//3
              name:"Stone",
              type:blockType.FULL,
              textureIndex:[
                  Texture.testAtkas.indexMap.get("stone"),
                  Texture.testAtkas.indexMap.get("stone"),
                  Texture.testAtkas.indexMap.get("stone"),
                  Texture.testAtkas.indexMap.get("stone"),
                  Texture.testAtkas.indexMap.get("stone"),
                  Texture.testAtkas.indexMap.get("stone")
              ],
              breakTime:20
          },
          {//4
              name:"Greenstone ore",
              type:blockType.FULL,
              textureIndex:[
                  Texture.testAtkas.indexMap.get("greenstone"),
                  Texture.testAtkas.indexMap.get("greenstone"),
                  Texture.testAtkas.indexMap.get("greenstone"),
                  Texture.testAtkas.indexMap.get("greenstone"),
                  Texture.testAtkas.indexMap.get("greenstone"),
                  Texture.testAtkas.indexMap.get("greenstone")
              ],
              breakTime:20
          },
          {//5
              name:"Greenstone block",
              type:blockType.FULL,
              textureIndex:[
                  Texture.testAtkas.indexMap.get("greenstoneBlock"),
                  Texture.testAtkas.indexMap.get("greenstoneBlock"),
                  Texture.testAtkas.indexMap.get("greenstoneBlock"),
                  Texture.testAtkas.indexMap.get("greenstoneBlock"),
                  Texture.testAtkas.indexMap.get("greenstoneBlock"),
                  Texture.testAtkas.indexMap.get("greenstoneBlock")
              ],
              breakTime:10
          },
          {//6
              name:"log",
              type:blockType.FULL,
              textureIndex:[
                  Texture.testAtkas.indexMap.get("logTop"),
                  Texture.testAtkas.indexMap.get("logTop"),
                  Texture.testAtkas.indexMap.get("logSide"),
                  Texture.testAtkas.indexMap.get("logSide"),
                  Texture.testAtkas.indexMap.get("logSide"),
                  Texture.testAtkas.indexMap.get("logSide")
              ],
              breakTime:5
          },
          {//7
              name:"White",
              type:blockType.FULL,
              textureIndex:[
                  Texture.testAtkas.indexMap.get("whiteBlock"),
                  Texture.testAtkas.indexMap.get("whiteBlock"),
                  Texture.testAtkas.indexMap.get("whiteBlock"),
                  Texture.testAtkas.indexMap.get("whiteBlock"),
                  Texture.testAtkas.indexMap.get("whiteBlock"),
                  Texture.testAtkas.indexMap.get("whiteBlock")
              ],
              breakTime:20
    
          },
          {//8
              name:"Yellow",
              type:blockType.FULL,
              textureIndex:[
                  Texture.testAtkas.indexMap.get("redBlock"),
                  Texture.testAtkas.indexMap.get("redBlock"),
                  Texture.testAtkas.indexMap.get("redBlock"),
                  Texture.testAtkas.indexMap.get("redBlock"),
                  Texture.testAtkas.indexMap.get("redBlock"),
                  Texture.testAtkas.indexMap.get("redBlock")
              ],
              breakTime:20
          },
          {//9
              name:"Leaves",
              type:blockType.FULL,
              textureIndex:[
                  Texture.testAtkas.indexMap.get("leaves"),
                  Texture.testAtkas.indexMap.get("leaves"),
                  Texture.testAtkas.indexMap.get("leaves"),
                  Texture.testAtkas.indexMap.get("leaves"),
                  Texture.testAtkas.indexMap.get("leaves"),
                  Texture.testAtkas.indexMap.get("leaves")
              ],
              breakTime:0.2
          },
          {//10
              name:"Glowstone",
              type:blockType.FULL,
              textureIndex:[
                  Texture.testAtkas.indexMap.get("glowstone"),
                  Texture.testAtkas.indexMap.get("glowstone"),
                  Texture.testAtkas.indexMap.get("glowstone"),
                  Texture.testAtkas.indexMap.get("glowstone"),
                  Texture.testAtkas.indexMap.get("glowstone"),
                  Texture.testAtkas.indexMap.get("glowstone")
              ],
              breakTime:5,
              glowing:15
          },
          {//11
              name:"Snow",
              type:blockType.FULL,
              textureIndex:[
                  Texture.testAtkas.indexMap.get("snow"),
                  Texture.testAtkas.indexMap.get("snow"),
                  Texture.testAtkas.indexMap.get("snow"),
                  Texture.testAtkas.indexMap.get("snow"),
                  Texture.testAtkas.indexMap.get("snow"),
                  Texture.testAtkas.indexMap.get("snow")
              ],
              breakTime:1
          },
          {//12
              name:"Dirt slab",
              type:blockType.NOTFULL,
              textureIndex:[
                  Texture.testAtkas.indexMap.get("dirt"),
                  Texture.testAtkas.indexMap.get("dirt"),
                  Texture.testAtkas.indexMap.get("dirtSlab"),
                  Texture.testAtkas.indexMap.get("dirtSlab"),
                  Texture.testAtkas.indexMap.get("dirtSlab"),
                  Texture.testAtkas.indexMap.get("dirtSlab")
              ],
              customMesh:slab,
              breakTime:1
          }];
    }
    static info:Array<{name,textureIndex?:number[],breakTime?,glowing?,type:blockType,customMesh?:number[][]}> = [];
}
export class RotatableBlock extends Block
{
    sideTop:Side = Side.top;
}
export enum Side
{
   top,bottom,front,back,left, right
}
export const directions = Object.freeze(
    {
        UNDEF:0,
        POS_X:1,
        NEG_X:2,
        POS_Z:3,
        NEG_Z:4,
        POS_Y:5,
        NEG_Y:6,
        SOURCE:7
    }
);
export const dirAssoc = Object.freeze(
    {
        1:new Vector4(1,0,0),
        2: new Vector4(-1,0,0),
        3: new Vector4(0,0,1),
        4: new Vector4(0,0,-1),
        5: new Vector4(0,1,0),
        6: new Vector4(0,-1,0)
    }
);
const slab =[
    [//top
        -0.5,0.0,-0.5,
        -0.5,0.0,0.5,  
        0.5,0.0 ,0.5,
        0.5,0.0,-0.5,
    ],
    [//bottom
        0.5,-0.5 ,0.5,
        -0.5,-0.5,0.5,
        -0.5,-0.5,-0.5,
        0.5,-0.5,-0.5  
    ],
   
    [//Front
        0.5,0.0,0.5,
        
        -0.5,0.0,0.5,
        -0.5,-0.5,0.5,
        0.5,-0.5,0.5, 
    ],
    //Back
    [
        -0.5,-0.5,-0.5,
        -0.5,0.0,-0.5,
        0.5,0.0,-0.5,       
        0.5,-0.5,-0.5,

    ],
    //left
    [
        0.5,0.0 ,0.5,
        0.5,-0.5,0.5,
        0.5,-0.5,-0.5,
        0.5,0.0,-0.5,
    ],
    //right
    [
        -0.5,0.0 ,0.5,
        -0.5,0.0,-0.5, 
        -0.5,-0.5,-0.5,  
        -0.5,-0.5,0.5,
    ]
];