using System.Text.Json.Serialization;

public class PacketClientWalk : Packet {

    [JsonPropertyName("speed")]
    public double Speed { get; set; }

    [JsonPropertyName("direction")]
    public byte Direction { get; set; }

    [JsonPropertyName("x")]
    public int X { get; set; }

    [JsonPropertyName("y")]
    public int Y { get; set; }
}