# mcTS
Minecraft like game written in webgl with bad graphics
Creating chunks can take some time before rendering, please wait one minute if you wanna see anything
(Link on the side(github pages) leads to older version without need of server, but also without features of new)
(Written for fun without optimizations or proper light algorithm)
# HOW TO RUN 
To run this game you need to compile server and client,
which you can do using compileRun.sh script in this repo
or by manually going into Client and Server directories,
and typing 
```npm install```
```npx tsc```
when ready run the Main.js file located in Server/build with node(node Main.js),
and it should give an address, on which game is run,
enter this address in browser, and you should see the
menu gui.
