export function isIn(x, y, bb) {
    if (x > bb.x && x < bb.dx && y > bb.y && y < bb.dy)
        return true;
    return false;
}
