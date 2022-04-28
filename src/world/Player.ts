import Camera from "../render/Camera.ts";
import Sprite from "../render/sprites/Sprite.ts";
import Direction from "../render/Direction.ts";
import Map from "../world/Map.ts";
import Point from "../misc/Point.ts";

export default class Player {

    isWalking = false;
    camera: Camera;
    map: Map;

    sprites: Sprite[][] = [];
    overlaySprites: Sprite[][][] = [];

    animationState = 0;
    direction = Direction.Down;

    _x = 0;
    _y = 0;

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set x(value: number) {
        if (!this.map.canWalk(value, this.y)) {
            this._x = value;
            this.camera.x = value;
        }
    }

    set y(value: number) {
        if (!this.map.canWalk(this.x, value)) {
            this._y = value;
            this.camera.y = value;
        }
    }

    constructor(camera: Camera, sprite: Sprite, map: Map, spawn: Point, ...overlaySprites: Sprite[]) {
        this.camera = camera;
        this.map = map;

        this.camera.x = this._x = Map.toPixelUnits(spawn.x) + 8;
        this.camera.y = this._y = Map.toPixelUnits(spawn.y) + 8;

        for (let y = 0; y < 4; y++) {
            let row: Sprite[] = [];
        
            for (let x = 0; x < 4; x++) {
                row.push(sprite.cut(x * 16, y * 32, 16, 32));
            }
        
            this.sprites.push(row);
        }

        for (let overlaySprite of overlaySprites) {
            let overlaySpritesSprite: Sprite[][] = [];

            for (let y = 0; y < 4; y++) {
                let row: Sprite[] = [];
            
                for (let x = 0; x < 4; x++) {
                    row.push(overlaySprite.cut(x * 16, y * 32, 16, 32));
                }
            
                overlaySpritesSprite.push(row);
            }

            this.overlaySprites.push(overlaySpritesSprite);
        }
    }

    modifyPosition(direction: Direction, difference: number) {
        switch (direction) {
            case Direction.Left:
                this.x -= difference;
                break;

            case Direction.Right:
                this.x += difference;
                break;

            case Direction.Up:
                this.y -= difference;
                break;
                
            case Direction.Down:
                this.y += difference;
                break;
        }
    }

    walk(direction: Direction, getSpeed: () => number, hasStopped: () => boolean) {
        if (this.isWalking) {
            return;
        }

        this.isWalking = true;
        this.direction = direction;

        for (let i = 0; i < 16; i++) {
            await wait(10 / getSpeed());

            if (hasStopped()) {
                this.animationState = 0;
                this.isWalking = false;
                return;
            }

            if (i % 8 == 0) {
                this.animationState = (this.animationState + 1) % 4;
            }

            this.modifyPosition(direction, 1);
        }
        
        this.isWalking = false;
    }

    async draw() {
        this.sprites[this.direction][this.animationState].drawAtCentered(this.x, this.y - 8);

        for (const sprites of this.overlaySprites) {
            sprites[this.direction][this.animationState].drawAtCentered(this.x, this.y - 8);
        }
    }
}
