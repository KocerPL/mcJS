export class World {
    Chunks = new Array();
    tasks;
    update(startTime) {
        let actualTime = Date.now();
        while (this.tasks.length > 0 && actualTime - 5 < startTime) {
            actualTime = Date.now();
            console.log(actualTime);
            let work = this.tasks.shift();
            work();
        }
    }
    getBlock() {
    }
}
