import Controller from "../controller/Controller.ts";

import Camera from "../render/Camera.ts";
import Sprite from "../render/sprites/Sprite.ts";
import MapData from "./MapData.ts";
import SpecialTiles from "./SpecialTiles.ts";
import { getMillis } from "../misc/Utils.ts";

export default class Map {

    controller: Controller;
    camera: Camera;
    tilesSprite: Sprite; 
    data: MapData;

    entityLayer = 1;

    get layerCount() {
        return this.data.layers.length;
    }

    constructor(camera: Camera, sprite: Sprite, data: MapData, controller: Controller) {
        this.camera = camera;
        this.tilesSprite = sprite;
        this.data = data;
        this.controller = controller;
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
        let gridX = Map.toGridUnits(x);
        let gridY = Map.toGridUnits(y);

        return x < 0
            || x >= Map.toPixelUnits(this.data.width)
            || y < 0
            || y >= Map.toPixelUnits(this.data.height)
            || this.isEmpty(gridX, gridY)
            || this.data.layers.some(layer => SpecialTiles.isBlockPointSolid(layer[gridX][gridY], Math.floor(x % 16), Math.floor(y % 16)));
    }

    draw(drawEntities: () => void) {
        let tilesInWidth = this.tilesSprite.width / 16;

        for (let layerId = this.layerCount - 1; layerId >= 0; layerId--) {
            for (let x = 0; x < this.data.width; x++) {
                for (let y = 0; y < this.data.height; y++) {
                    let id = this.data.layers[layerId][x][y];

                    if (id === -1 || (SpecialTiles.all.includes(id) && !this.controller.developerMode)) {
                        continue;
                    }

                    let waterAnimation = SpecialTiles.waterTiles.waterAnimation;

                    if (waterAnimation.includes(id)) {
                        id = waterAnimation[Math.floor(getMillis() / 250) % waterAnimation.length];
                    }

                    this.tilesSprite.cut(Math.floor(id % tilesInWidth) * 16, Math.floor(id / tilesInWidth) * 16, 16, 16).drawAt(x * 16, y * 16);
                }
            }

            if (this.entityLayer == layerId) {
                drawEntities();
            }
        }

        // TODO: Wasseranimation (112-114)
        // TODO: Funktionsblöcke implementieren
    }
}
