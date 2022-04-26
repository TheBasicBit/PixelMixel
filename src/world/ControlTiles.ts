export default class ControlTiles {
    
    static get barriers() {
        return [
            123, 124, 125,
            139, 140, 141,
            155, 156, 157,
            142, 143,
            158, 159
        ];
    }
    
    static get all() {
        return [
            ...this.barriers,
            
            // Spawn
            137,
        ];
    }
}