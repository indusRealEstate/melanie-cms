import { Component, HostListener, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "app/services/auth.service";

import { MatSnackBar } from "@angular/material/snack-bar";
import { WebsocketService } from "app/services/websocket.service";

@Component({
  selector: "app-chat-beta",
  templateUrl: "./chat-beta.component.html",
  styleUrls: ["./chat-beta.component.scss"],
})
export class ChatBetaComponent implements OnInit {
  chat_text: any = "";

  all_chats: any[] = [];

  constructor(
    public socketService: WebsocketService,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    if (!this.authService.currentUserValue) {
      this.router.navigate(["/login"]);
    }
  }

  @HostListener("document:keydown.enter")
  onDocumentKeydownEnter() {
    this.sendMessage();
  }

  ngOnInit() {}

  sendMessage() {
    if (this.chat_text != "") {
      this.socketService.sendMessage(this.chat_text, "text");
      this.chat_text = "";
    }
  }

  fileChangeEvent(files: File[]): void {
    const reader = new FileReader();

    reader.onload = (event) => {
      this.socketService.sendMessage(event.target.result as string, "image");
    };

    reader.readAsDataURL(files[0]);
  }
}
