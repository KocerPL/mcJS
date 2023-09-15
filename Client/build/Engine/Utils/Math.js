export function randRange(min, max) {
    return (Math.random() * (max - min)) + min;
}
export function clamp(num, min, max) {
    return Math.max(Math.min(num, max), min);
}
