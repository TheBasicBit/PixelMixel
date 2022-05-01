import Game from '../Game.ts';
import Packet from './packets/Packet.ts';
import PacketServerDespawn from './packets/server/PacketServerDespawn.ts';
import PacketServerSpawn from './packets/server/PacketServerSpawn.ts';
import PacketServerEntityWalk from './packets/server/PacketServerEntityWalk.ts';
import PacketClientWalk from './packets/client/PacketClientWalk.ts';
import Player from "../world/Player.ts";
import Direction from "../render/Direction.ts";

export default class NetworkManager {

    game: Game;
    webSocket?: WebSocket;

    constructor(game: Game) {
        this.game = game;
    }
    
    connect() {
        return new Promise<void>((resolve, reject) => {
            this.webSocket = new WebSocket(`${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/client`, "gameClient");
            
            this.webSocket.onopen = function() {
                resolve();
            };

            this.webSocket.onerror = function(error) {
                reject(error);
            };

            this.webSocket.onmessage = (e) => {
                this.onPacket(JSON.parse(e.data));
            };
        });
    }

    onPacket(packet: Packet) {
        switch (packet.packetType) {
            case "PacketServerSpawn":
                let packetServerSpawn = <PacketServerSpawn>packet;
                
                this.game.otherPlayers[packetServerSpawn.entityId] = new Player(
                    this.game,
                    this.game.resources!.playerSprite,
                    {x: packetServerSpawn.x, y: packetServerSpawn.y},
                    false
                );
                
                break;

            case "PacketServerDespawn":
                let packetServerDespawn = <PacketServerDespawn>packet;
                delete this.game.otherPlayers[packetServerDespawn.entityId];
                break;
    
            case "PacketServerEntityWalk":
                let packetServerEntityWalk = <PacketServerEntityWalk>packet;
                
                let entity = this.game.otherPlayers[packetServerEntityWalk.entityId];
                entity.walk(packetServerEntityWalk.direction, packetServerEntityWalk.speed);

                if (entity.x !== packetServerEntityWalk.x) {
                    entity.x = packetServerEntityWalk.x;
                }

                if (entity.y !== packetServerEntityWalk.y) {
                    entity.y = packetServerEntityWalk.y;
                }

                break;
        }
    }

    send(packet: Packet) {
        this.webSocket?.send(JSON.stringify(packet));
    }

    sendWalk(direction: Direction, speed: number, x: number, y: number) {
        this.send(new PacketClientWalk(direction, speed, x, y));
    }
}
