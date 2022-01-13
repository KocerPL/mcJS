var Main = /** @class */ (function () {
    function Main() {
    }
    Main.run = function () {
        var out = document.createElement("output");
        out.value = "okok";
        out.style.color = "white";
        document.body.appendChild(out);
    };
    return Main;
}());
Main.run();
