import { Component, OnInit } from "@angular/core";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "dashboard", class: "" },
  {
    path: "/main-slider",
    title: "Top Banner Slider",
    icon: "photo_library",
    class: "",
  },
  {
    path: "/ad-banner",
    title: "Featured Projects Banner",
    icon: "view_comfy",
    class: "",
  },
  { path: "/blogs", title: "Blogs", icon: "library_books", class: "" },
  { path: "/news", title: "News", icon: "newspaper", class: "" },
  { path: "/popup-ad", title: "Popup Ad", icon: "aspect_ratio", class: "" },
  { path: "/reviews", title: "Google Reviews", icon: "reviews", class: "" },
  { path: "/team", title: "Team", icon: "groups", class: "" },
  { path: "/developers", title: "Developers", icon: "domain", class: "" },
  { path: "/videos", title: "Videos", icon: "movie", class: "" },
  { path: "/achievements", title: "Achievements", icon: "emoji_events", class: "" },
  { path: "/community-guides", title: "Community Guides", icon: "book", class: "" },
  { path: "/optimize-img", title: "Optimize Image", icon: "compare", class: "" },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
