export default interface Sprite {
    width: number;
    height: number;

    drawAtUI(x: number, y: number): void;
    drawAtUICentered(x: number, y: number): void;
    drawAt(x: number, y: number): void;
    drawAtCentered(x: number, y: number): void;
    cut(x: number, y: number, width: number, height: number): Sprite;
}