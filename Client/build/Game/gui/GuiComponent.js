export class GuiComponent {
    visible;
    changed;
    transformation;
    vertices;
    textureCoords;
    indices;
    set setVisible(visible) {
        this.changed = true;
        this.visible = visible;
    }
    get getVisible() {
        return this.visible;
    }
}
