import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
  PopStateEvent,
} from "@angular/common";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import PerfectScrollbar from "perfect-scrollbar";
import * as $ from "jquery";
import { filter, Subscription } from "rxjs";
import { AuthService } from "app/services/auth.service";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"],
})
export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  isUserSignedOut: boolean = true;
  isLogoutProcessing: boolean = false;

  constructor(
    public location: Location,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.currentUserValue) {
      this.isUserSignedOut = false;
      if (router.url == "/login") {
        this.router.navigate(["/dashboard"]);
      } else {
        this.router.navigate([router.url]);
      }
    } else {
      this.isUserSignedOut = true;
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit() {
    const isWindows = navigator.platform.indexOf("Win") > -1 ? true : false;
  }

  onActivate(event) {
    // window.scroll(0,0);

    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  ngAfterViewInit() {
    this.runOnRouteChange();
  }

  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
    let bool = false;
    if (
      navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
      navigator.platform.toUpperCase().indexOf("IPAD") >= 0
    ) {
      bool = true;
    }
    return bool;
  }
}
