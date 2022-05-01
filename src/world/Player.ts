import Camera from "../render/Camera.ts";
import Sprite from "../render/sprites/Sprite.ts";
import Direction from "../render/Direction.ts";
import Map from "../world/Map.ts";
import Point from "../misc/Point.ts";
import Game from "../Game.ts";

export default class Player {

    game: Game;
    camera: Camera;
    map: Map;

    sprites: Sprite[][] = [];
    overlaySprites: Sprite[][][] = [];

    direction = Direction.Down;

    lastMove = performance.now();
    walkSpeed = 1;

    isFirstPlayer = false;

    get isMoving() {
        return performance.now() - this.lastMove < 100;
    }

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

        if (this.isFirstPlayer) {
            this.camera.x = value;
        }
    }

    set y(value: number) {
        this._y = value;

        if (this.isFirstPlayer) {
            this.camera.y = value;
        }
    }

    constructor(game: Game, sprite: Sprite, spawn: Point, isFirstPlayer: boolean, ...overlaySprites: Sprite[]) {
        this.game = game;
        this.camera = game.camera!;
        this.map = game.map!;
        this.isFirstPlayer = isFirstPlayer;

        if (isFirstPlayer) {
            this.camera.x = this._x = Map.toPixelUnits(spawn.x) + 8;
            this.camera.y = this._y = Map.toPixelUnits(spawn.y) + 8;
        }

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
                this.lastMove = performance.now();
                return;
            }
        }

        this.lastMove = performance.now();
    }

    walk(direction: Direction, speed: number) {
        this.direction = direction;
        this.walkSpeed = speed;

        this.move(direction, speed * this.camera.deltaTime * 0.08);
        
        if (this.isFirstPlayer) {
            this.game.networkManager?.sendWalk(direction, speed, this.x, this.y);
        }
    }

    async draw() {
        let animationState = 0;

        if (this.isMoving) {
            animationState = Math.floor((performance.now() / 200 * this.walkSpeed) % 4);
        }

        this.sprites[this.direction][animationState].drawAtCentered(this.x, this.y - 8);

        for (const sprites of this.overlaySprites) {
            sprites[this.direction][animationState].drawAtCentered(this.x, this.y - 8);
        }
    }
}
