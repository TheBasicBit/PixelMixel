function readJson(filePath) {
    return JSON.parse(Deno.readTextFileSync(filePath));
}

function writeJson(filePath, obj) {
    Deno.writeTextFileSync(filePath, JSON.stringify(obj));
}

const spawnTile = 137;

let map = readJson("input.json");
let layers = [];
let spawnPoints = [];

for (const layer of map.layers) {
    let columns = {};

    for (const tile of layer.tiles) {
        if (!(tile.x in columns)) {
            columns[tile.x] = {};
        }

        if (tile.tile == spawnTile) {
            spawnPoints.push({x: tile.x, y: tile.y});
            columns[tile.x][tile.y] = -1;
        } else {
            columns[tile.x][tile.y] = tile.tile;
        }
    }

    layers.push(columns);
}

writeJson("map.json", { width: map.tileswide, height: map.tileshigh, layers: layers, spawnPoints: spawnPoints });
