import express = require("express");
import http = require("http");
import { dirname } from "path";

const app = express();
const server =http.createServer(app);
let pos=__dirname.length-1;
for(let i=0;i<2;pos--)
{
    if(__dirname.at(pos)=="/")
        i++;
}
const rDir = __dirname.substring(0,pos+1);
app.get("/",(req,res)=>{
    res.sendFile(rDir+"/Client/index.html");
});
app.get("*",(req,res)=>{
  //  console.log(rDir+"/Client/index.html");
    res.sendFile(rDir+"/Client"+req.path);
});

server.listen(3000,()=>{
    console.log("listening on 3000");
});