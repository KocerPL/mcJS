export class CanvaManager {
    static canva = document.createElement("canvas");
    static HEIGHT = window.innerHeight;
    static WIDTH = window.innerWidth;
    static gl = this.canva.getContext("webgl2");
    static proportion = 1024 / 1920;
    static setupCanva(location, proportion) {
        this.proportion = proportion ?? this.proportion;
        location.appendChild(this.canva);
        window.addEventListener("resize", this.onResize.bind(this), false);
        this.onResize();
        return this.canva;
    }
    static onResize() {
        if (window.innerHeight > window.innerWidth) {
            this.WIDTH = window.innerWidth;
            this.HEIGHT = window.innerWidth * this.proportion;
        }
        else {
            this.WIDTH = window.innerHeight / this.proportion;
            this.HEIGHT = window.innerHeight;
        }
        this.applyResize();
    }
    static applyResize() {
        this.canva.width = this.WIDTH;
        this.canva.height = this.HEIGHT;
    }
    static get getProportion() {
        return this.proportion;
    }
    static get getWidth() {
        return this.WIDTH;
    }
}
