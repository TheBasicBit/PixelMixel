import Packet from "../Packet.ts";

export default interface PacketServerDespawn extends Packet {
    entityId: number;
}