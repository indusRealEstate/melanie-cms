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
  { path: "/property-listings", title: "All Listings", icon: "apartment", class: "" },
  { path: "/all-categories", title: "All Categories", icon: "category", class: "" },
  { path: "/all-agents", title: "All Agents", icon: "group", class: "" },
  { path: "/in-focus", title: "In Focus", icon: "filter_frames", class: "" },
  { path: "/landing-page-slider", title: "Landing Page Slider", icon: "view_carousel", class: "" },
  { path: "/rental-slider", title: "Rentals Slider", icon: "view_carousel", class: "" },
  { path: "/display-sales", title: "Display Sales", icon: "holiday_village", class: "" },
  { path: "/display-rentals", title: "Display Rentals", icon: "holiday_village", class: "" },
  { path: "/projects", title: "Display Projects", icon: "holiday_village", class: "" },
  { path: "/display-two-beds", title: "Display Two Beds", icon: "holiday_village", class: "" },
  { path: "/display-one-beds", title: "Display One Beds", icon: "holiday_village", class: "" },
  { path: "/display-studios", title: "Display Studios", icon: "holiday_village", class: "" },
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
