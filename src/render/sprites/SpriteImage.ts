import Camera from '../Camera.ts';
import Sprite from "./Sprite.ts";
import CuttedSprite from "./CuttedSprite.ts";

export default class SpriteImage implements Sprite {

    image: HTMLImageElement;
    camera: Camera;

    get width() {
        return this.image.width;
    }

    get height() {
        return this.image.height;
    }

    constructor(camera: Camera, image: HTMLImageElement) {
        this.camera = camera;
        this.image = image;
    }

    drawAtUI(x: number, y: number): void {
        this.camera.context.drawImage(this.image, Math.floor(x), Math.floor(y));
    }

    drawAtUICentered(x: number, y: number): void {
        this.drawAtUI(x - (this.image.width / 2), y - (this.image.height / 2));
    }

    drawAt(x: number, y: number): void {
        let cameraOffsetX = this.camera.x - (this.camera.width / 2);
        let cameraOffsetY = this.camera.y - (this.camera.height / 2);
        this.camera.context.drawImage(this.image, Math.floor(x - cameraOffsetX), Math.floor(y - cameraOffsetY));
    }

    drawAtCentered(x: number, y: number): void {
        this.drawAt(x - (this.image.width / 2), y - (this.image.height / 2));
    }

    cut(x: number, y: number, width: number, height: number): Sprite {
        return new CuttedSprite(this, x, y, width, height);
    }
}