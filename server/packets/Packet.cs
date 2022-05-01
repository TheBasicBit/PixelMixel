using System.Text.Json.Serialization;

public class Packet {

    [JsonPropertyName("packetType")]
    public string PacketType { get; set; }
}