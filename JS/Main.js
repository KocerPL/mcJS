import { Vector } from "./Utils/Vector.js";
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.run = function () {
        var vec = new Vector(1, 2, 3);
        console.log(vec);
    };
    return Main;
}());
Main.run();
