using System.Text.Json.Serialization;

public class PacketServerDespawn : Packet {

    [JsonPropertyName("entityId")]
    public ulong EntityId { get; set; }
}