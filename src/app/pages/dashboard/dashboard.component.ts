import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "app/services/auth.service";
import { DashboardService } from "app/services/dashboard.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  blogs_count: any = 0;
  news_count: any = 0;
  users_count: any = 0;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.currentUserValue) {
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit() {
    this.dashboardService.getallStats().subscribe((data) => {
      this.blogs_count = data.blogs_count;
      this.news_count = data.news_count;
      this.users_count = data.users_count;
    });
  }
}
