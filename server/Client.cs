using System.Threading;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Collections.Generic;

public class Client {
    
    private static readonly IdManager idManager = new();

    private static readonly List<Client> clients = new();
    
    private WebSocket webSocket;

    public ulong Id { get; set; }

    public int X { get; set; } = 0;

    public int Y { get; set; } = 0;

    public Client(HttpListenerWebSocketContext context) {
        Id = idManager.CreateNewId();
        clients.Add(this);

        webSocket = context.WebSocket;

        HandleInputs();
    }

    private async Task<string?> ReceiveStringAsync() {
        WebSocketReceiveResult result;
        List<byte> resultBuffer = new();

        do {
            var buffer = new byte[4096];
            result = await webSocket.ReceiveAsync(buffer, CancellationToken.None);

            if (result.MessageType != WebSocketMessageType.Text) {
                return null;
            }

            resultBuffer.AddRange(buffer.Take(result.Count));
        } while (webSocket.State == WebSocketState.Open && !result.EndOfMessage);

        if (result.EndOfMessage) {
            return Encoding.UTF8.GetString(resultBuffer.ToArray());
        } else {
            return null;
        }
    }

    public async Task Send<T>(T packet) where T : Packet {
        var chunks = Encoding.UTF8.GetBytes(JsonSerializer.Serialize<T>(packet))
            .Chunk(4096)
            .ToArray();

        for (int i = 0; i < chunks.Length; i++) {
            await webSocket.SendAsync(chunks[i], WebSocketMessageType.Text, chunks.Length - 1 == i, CancellationToken.None);
        }
    }

    public IEnumerable<Client> Others => clients
        .ToArray()
        .Where(client => client.Id != Id);

    public async Task SendToOther<T>(T packet) where T : Packet {
        foreach (var client in Others) {
            await client.Send(packet);
        }
    }

    public async void HandleInputs() {
        foreach (var client in Others) {
            Send(new PacketServerSpawn() {
                PacketType = nameof(PacketServerSpawn),
                EntityId = client.Id,
                X = client.X,
                Y = client.Y,
            });
        }

        await SendToOther(new PacketServerSpawn() {
            PacketType = nameof(PacketServerSpawn),
            EntityId = Id,
            X = X,
            Y = Y,
        });

        try {
            while (webSocket.State == WebSocketState.Open) {
                var json = await ReceiveStringAsync();

                if (json == null) {
                    continue;
                }

                Packet packet = JsonSerializer.Deserialize<Packet>(json);

                if (packet == null) {
                    continue;
                }

                switch (packet.PacketType) {
                    case nameof(PacketClientWalk):
                        PacketClientWalk packetClientWalk = JsonSerializer.Deserialize<PacketClientWalk>(json);
                        
                        X = packetClientWalk.X;
                        Y = packetClientWalk.Y;

                        SendToOther(new PacketServerEntityWalk() {
                            PacketType = nameof(PacketServerEntityWalk),
                            EntityId = Id,

                            Direction = packetClientWalk.Direction,
                            Speed = packetClientWalk.Speed,
                            X = packetClientWalk.X,
                            Y = packetClientWalk.Y,
                        });

                        break;
                }
            }
        } catch {}

        SendToOther(new PacketServerDespawn() {
            PacketType = nameof(PacketServerDespawn),
            EntityId = Id,
        });

        clients.Remove(this);
    }
}