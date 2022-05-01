import Packet from "../Packet.ts";

export default interface PacketServerSpawn extends Packet {
    entityId: number;
    x: number;
    y: number;
}