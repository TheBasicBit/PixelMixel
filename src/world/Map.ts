import Controller from "../controller/Controller.ts";

import Camera from "../render/Camera.ts";
import Sprite from "../render/sprites/Sprite.ts";
import MapData from "./MapData.ts";
import ControlTiles from "./ControlTiles.ts";

export default class Map {

    drawEntities: () => void;

    controller: Controller;
    camera: Camera;
    tilesSprite: Sprite; 
    data: MapData;

    entityLayer = 1;

    get layerCount() {
        return this.data.layers.length;
    }

    constructor(camera: Camera, sprite: Sprite, data: MapData, controller: Controller, drawEntities: () => void) {
        this.camera = camera;
        this.tilesSprite = sprite;
        this.data = data;
        this.controller = controller;

        this.drawEntities = drawEntities;
    }

    static toGridUnits(value: number) {
        return Math.floor(value / 16);
    }

    static toPixelUnits(value: number) {
        return value * 16;
    }

    containsTile(x: number, y: number, id: number) {
        for (let i = 0; i < this.layerCount; i++) {
            if (this.data.layers[i][x][y] === id) {
                return true;
            }
        }

        return false;
    }

    isEmpty(x: number, y: number) {
        for (let i = 0; i < this.layerCount; i++) {
            if (this.data.layers[i][x][y] !== -1) {
                return false;
            }
        }

        return true;
    }

    canWalk(x: number, y: number) {
        const space = 6;

        return this.isSolid(x, y)
            || this.isSolid(x + space, y)
            || this.isSolid(x - space, y)
            || this.isSolid(x, y + space)
            || this.isSolid(x, y - space)
            || this.isSolid(x - space, y + space)
            || this.isSolid(x - space, y - space)
            || this.isSolid(x + space, y + space)
            || this.isSolid(x + space, y - space);
    }

    isSolid(x: number, y: number) {
        let pixelWidth = Map.toPixelUnits(this.data.width);
        let pixelHeight = Map.toPixelUnits(this.data.height);
        let gridX = Map.toGridUnits(x);
        let gridY = Map.toGridUnits(y);

        return x < 0 || x >= pixelWidth || y < 0 || y >= pixelHeight || this.isEmpty(gridX, gridY);
    }

    draw() {
        let tilesInWidth = this.tilesSprite.width / 16;

        for (let layerId = this.layerCount - 1; layerId >= 0; layerId--) {
            for (let x = 0; x < this.data.width; x++) {
                for (let y = 0; y < this.data.height; y++) {
                    let id = this.data.layers[layerId][x][y];

                    if (id === -1 || (ControlTiles.includes(id) && !this.controller.isKeyDown("r"))) {
                        continue;
                    }

                    this.tilesSprite.cut(Math.floor(id % tilesInWidth) * 16, Math.floor(id / tilesInWidth) * 16, 16, 16).drawAt(x * 16, y * 16);
                }
            }

            if (this.entityLayer == layerId) {
                this.drawEntities();
            }
        }

        // TODO: Wasseranimation (112-114)
        // TODO: Funktionsblöcke implementieren
    }
}
