import Sprite from "./Sprite.ts";

export default class ItemRenderer implements Sprite {

    animatedSprite: Sprite;
    delay: number;

    width = 16;
    height = 16;

    constructor(animatedSprite: Sprite, delay: number) {
        this.animatedSprite = animatedSprite;
        this.delay = delay;
    }

    private get time() {
        let date = new Date();
        let hour = date.getHours();
        let min = hour * 60 + date.getMinutes();
        let sec = min * 60 + date.getSeconds();
        let milli = sec * 1000 + date.getMilliseconds();

        return milli;
    }

    private get sprite(): Sprite {
        let frames = this.animatedSprite.width / 16;
        let frame = Math.floor(this.time / this.delay) % frames;
        
        return this.animatedSprite.cut(frame * 16, 0, 16, 16);
    }

    drawAtUI(x: number, y: number): void {
        this.sprite.drawAtUI(x, y);
    }

    drawAtUICentered(x: number, y: number): void {
        this.sprite.drawAtUICentered(x, y);
    }

    drawAt(x: number, y: number): void {
        this.sprite.drawAt(x, y);
    }

    drawAtCentered(x: number, y: number): void {
        this.sprite.drawAtCentered(x, y);
    }

    cut(x: number, y: number, width: number, height: number): Sprite {
        return this.sprite.cut(x, y, width, height);
    }
}
