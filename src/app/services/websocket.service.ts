import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WebsocketService {
  private socket!: WebSocket;
  private socketUrl = "ws://localhost:3000";

  constructor() {
    this.connect();
  }

  public all_messages: any[] = [];

  private connect(): void {
    this.socket = new WebSocket(this.socketUrl);

    this.socket.onopen = (event: Event) => {
      console.log("WebSocket connection opened", event);
    };

    this.socket.onmessage = (event: MessageEvent) => {
      // Handle incoming messages
      this.all_messages.push(JSON.parse(event.data));
    };

    this.socket.onclose = (event: CloseEvent) => {
      console.log("WebSocket connection closed", event);
      this.reconnect();
    };

    this.socket.onerror = (event: Event) => {
      console.error("WebSocket error", event);
    };
  }

  private reconnect(): void {
    setTimeout(() => {
      console.log("Reconnecting...");
      this.connect();
    }, 3000); // Adjust the delay between reconnection attempts as needed
  }

  sendMessage(message: string, type: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          message: message,
          type: type,
        })
      );
    } else {
      console.error("WebSocket is not open. Message not sent:", message);
    }
  }

  closeConnection(): void {
    this.socket.close();
  }

  getMessages(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.socket.onmessage = (event: MessageEvent) => {
        observer.next(event.data);
      };
    });
  }
}
