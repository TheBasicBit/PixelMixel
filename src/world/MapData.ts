type MapData = {
    width: number,
    height: number,

    layers: {
        [key: number]: {
            [key: number]: number
        }
    }[],

    spawnPoints: {
        x: number,
        y: number
    }[]
};

export default MapData;
