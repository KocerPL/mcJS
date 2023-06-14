import fs = require('fs');

for(let x=-4;x<4;x++)
for(let z=-4;z<4;z++)
    for(let y=0;y<16;y++)
    makeSubchunk(x,y,z);
function makeSubchunk(x,y,z)
{
    let n = y>8?0:1;
    let k:Array<number> = new Array(4096);
    for(let i=0; i<4096; i++)
    {
        k[i]= n;
    }
    fs.writeFileSync(__dirname+"/world/"+x+"."+y+"."+z+".sub",JSON.stringify(k));
}