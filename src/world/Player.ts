import Camera from "../render/Camera.ts";
import Sprite from "../render/sprites/Sprite.ts";
import Direction from "../render/Direction.ts";
import Map from "../world/Map.ts";
import Point from "../misc/Point.ts";

export default class Player {

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
        this._x = value;
        this.camera.x = value;
    }

    set y(value: number) {
        this._y = value;
        this.camera.y = value;
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

    move(direction: Direction, difference: number) {
        const performMove = () => {
            let newPosition = { x: this.x, y: this.y };

            switch (direction) {
                case Direction.Left:
                    newPosition.x -= 1;
                    break;

                case Direction.Right:
                    newPosition.x += 1;
                    break;

                case Direction.Up:
                    newPosition.y -= 1;
                    break;
                    
                case Direction.Down:
                    newPosition.y += 1;
                    break;
            }

            if (!this.map.canWalk(newPosition.x, newPosition.y)) {
                this.x = newPosition.x;
                this.y = newPosition.y;

                return true;
            }

            return false;
        }

        for (let i = 0; i < difference; i++) {
            if (!performMove()) {
                return;
            }
        }
    }

    walk(direction: Direction, getSpeed: () => number) {
        this.direction = direction;
        this.move(direction, getSpeed() * this.camera.deltaTime * 0.08);
    }

    async draw() {
        this.sprites[this.direction][this.animationState].drawAtCentered(this.x, this.y - 8);

        for (const sprites of this.overlaySprites) {
            sprites[this.direction][this.animationState].drawAtCentered(this.x, this.y - 8);
        }
    }
}
