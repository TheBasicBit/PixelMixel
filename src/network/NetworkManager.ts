export default class NetworkManager {

    webSocket?: WebSocket;
    
    connect() {
        return new Promise<void>((resolve, reject) => {
            this.webSocket = new WebSocket(`${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/client`, "gameClient");
            
            this.webSocket.onopen = function() {
                resolve();
            };

            this.webSocket.onerror = function(error) {
                reject(error);
            };
        });
    }
}
