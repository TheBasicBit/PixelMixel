using System.Net.WebSockets;

public class Client {
    
    private static readonly List<Client> clients = new();
    
    private WebSocket webSocket;

    public int X { get; set; } = 0;

    public int Y { get; set; } = 0;

    public Client(HttpListenerWebSocketContext context) {
        clients.Add(this);

        webSocket = context.WebSocket;

        HandleInputs();
    }

    private async Task<string> ReceiveStringAsync() {
        while (webSocket.State == WebSocketState.Open) {
            var buffer = new byte[4096];
            var result = await webSocket.ReceiveAsync(buffer, CancellationToken.None);
        }

        return "";
    }

    public async void HandleInputs() {
        while (webSocket.State == WebSocketState.Open) {

        }
    }
}