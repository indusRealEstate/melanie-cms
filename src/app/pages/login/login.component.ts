import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  username: any = "";
  password: any = "";

  processing: boolean = false;
  wrong_credential: boolean = false;
  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }
  ngOnInit() {}

  login() {
    this.processing = true;
    if (this.username != "" && this.password != "")
      this.authService
        .login(this.username, this.password)
        .subscribe((res) => {
          if (res != "invalid-user") {
            this.router.navigate(["/dashboard"]);
            location.reload();
          } else {
            this.wrong_credential = true;

            setTimeout(() => {
              this.wrong_credential = false;
            }, 3000);
          }
        })
        .add(() => {
          this.processing = false;
        });
  }
}
