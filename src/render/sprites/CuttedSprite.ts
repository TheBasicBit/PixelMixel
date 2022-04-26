import Camera from "../Camera.ts";
import Sprite from "./Sprite.ts";
import SpriteImage from "./SpriteImage.ts";

export default class CuttedSprite implements Sprite {

    spriteImage: SpriteImage;
    camera: Camera;

    x: number;
    y: number;
    width: number;
    height: number;

    constructor(sprite: Sprite, x: number, y: number, width: number, height: number) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.width = Math.floor(width);
        this.height = Math.floor(height);

        if (sprite instanceof SpriteImage) {
            this.spriteImage = sprite;
        } else if (sprite instanceof CuttedSprite) {
            this.spriteImage = sprite.spriteImage;
        } else {
            throw new Error("Invalid Image");
        }

        this.camera = this.spriteImage.camera;
    }

    drawAtUI(x: number, y: number): void {
        this.camera.context.drawImage(this.spriteImage.image, this.x, this.y, this.width, this.height, Math.floor(x), Math.floor(y), this.width, this.height);
    }

    drawAtUICentered(x: number, y: number): void {
        this.drawAtUI(x - (this.width / 2), y - (this.height / 2));
    }

    drawAt(x: number, y: number): void {
        let cameraOffsetX = this.camera.x - (this.camera.width / 2);
        let cameraOffsetY = this.camera.y - (this.camera.height / 2);
        this.camera.context.drawImage(this.spriteImage.image, this.x, this.y, this.width, this.height, Math.floor(x - cameraOffsetX), Math.floor(y - cameraOffsetY), this.width, this.height);
    }

    drawAtCentered(x: number, y: number): void {
        this.drawAt(x - (this.width / 2), y - (this.height / 2));
    }

    cut(x: number, y: number, width: number, height: number): Sprite {
        x += this.x;
        y += this.y;

        width = Math.min(width, this.width + x);
        height = Math.min(height, this.height + y);

        return new CuttedSprite(this, x, y, width, height);
    }
}