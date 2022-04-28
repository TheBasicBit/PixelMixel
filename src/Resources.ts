import Camera from "./render/Camera.ts";
import SpriteImage from "./render/sprites/SpriteImage.ts";
import MapData from "./world/MapData.ts";

function getUrl(path: string) {
    return document.querySelector("html>head>meta[base-url]")?.getAttribute("base-url") + path;
}

async function getObjectFromJson(path: string) {
    return await (await (fetch(getUrl(path))
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.error(err);
        })
    ));
}

async function getSpriteImage(camera: Camera, path: string) {
    return new Promise<SpriteImage>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(new SpriteImage(camera, img));
        img.onerror = reject;
        img.src = getUrl(path);
    });
}

export interface Resources {
    playerSprite: SpriteImage;
    mapSprite: SpriteImage;
    cursor: SpriteImage;
    slot: SpriteImage;
    hose: SpriteImage;
    emerald: SpriteImage;
    health: SpriteImage;
    mapData: MapData;
}

export async function loadResources(camera: Camera): Promise<Resources> {
    return {
        playerSprite: await getSpriteImage(camera, "assets/images/entities/human.png"),
        mapSprite: await getSpriteImage(camera, "assets/images/tiles/map.png"),
        cursor: await getSpriteImage(camera, "assets/images/ui/cursor.png"),
        slot: await getSpriteImage(camera, "assets/images/ui/inventorySlot.png"),
        hose: await getSpriteImage(camera, "assets/images/entities/hose.png"),
        emerald: await getSpriteImage(camera, "assets/images/items/pyschoEmerald.png"),
        health: await getSpriteImage(camera, "assets/images/ui/health.png"),
        mapData: await getObjectFromJson("map.json")
    };
};
