import { Routes } from "@angular/router";

import { AddNewListingComponent } from "app/pages/add-new-listing/add-new-listing.component";
import { DisplayRentalsComponent } from "app/pages/display-rentals/display-rentals.component";
import { DisplaySalesComponent } from "app/pages/display-sales/display-sales.component";
import { EditListingComponent } from "app/pages/edit-listing/edit-listing.component";
import { LandingPageSliderComponent } from "app/pages/landing-page-slider/landing-page-slider.component";
import { LoginComponent } from "app/pages/login/login.component";
import { DisplayOneBedsComponent } from "app/pages/one-beds/one-beds.component";
import { OptimizeImgComponent } from "app/pages/optimize-img/optimize-img.component";
import { ProjectsComponent } from "app/pages/projects/projects.component";
import { PropertyListingComponent } from "app/pages/property-listing/property-listing.component";
import { RentalSliderComponent } from "app/pages/rental-slider/rental-slider.component";
import { DisplayStudiosComponent } from "app/pages/studios/studios.component";
import { DisplayTwoBedsComponent } from "app/pages/two-beds/two-beds.component";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";

export const AdminLayoutRoutes: Routes = [
  
  /////////////////////////////////////////////////////////
  ////////////////////// new routes ///////////////////////
  /////////////////////////////////////////////////////////
  { path: "login", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "optimize-img", component: OptimizeImgComponent },
  { path: "property-listings", component: PropertyListingComponent },
  { path: "add-new-listing", component: AddNewListingComponent },
  { path: "edit-listing", component: EditListingComponent },
  { path: "landing-page-slider", component: LandingPageSliderComponent },
  { path: "projects", component: ProjectsComponent },
  { path: "rental-slider", component: RentalSliderComponent },
  { path: "display-sales", component: DisplaySalesComponent },
  { path: "display-rentals", component: DisplayRentalsComponent },
  { path: "display-two-beds", component: DisplayTwoBedsComponent },
  { path: "display-one-beds", component: DisplayOneBedsComponent },
  { path: "display-studios", component: DisplayStudiosComponent },
];
