using System.Text.Json.Serialization;

public class PacketServerSpawn : Packet {

    [JsonPropertyName("entityId")]
    public ulong EntityId { get; set; }

    [JsonPropertyName("x")]
    public int X { get; set; }

    [JsonPropertyName("y")]
    public int Y { get; set; }
}