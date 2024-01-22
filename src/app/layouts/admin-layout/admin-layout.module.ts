import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { EditorModule } from "@tinymce/tinymce-angular";
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
import { NgxDropzoneModule } from "ngx-dropzone";
import { ImageCropperModule } from "ngx-image-cropper";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { AllCategoriesComponent } from "app/pages/all-categories/all-categories.component";
import { AllAgentsComponent } from "app/pages/all-agents/all-agents.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    EditorModule,
    NgxSkeletonLoaderModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatMenuModule,
    DragDropModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ImageCropperModule,
    MatCheckboxModule,
    NgxDropzoneModule,
    MatSlideToggleModule,
    MatRadioModule,
  ],
  declarations: [
    LoginComponent,
    DashboardComponent,
    OptimizeImgComponent,
    PropertyListingComponent,
    AddNewListingComponent,
    EditListingComponent,
    LandingPageSliderComponent,
    ProjectsComponent,
    RentalSliderComponent,
    DisplaySalesComponent,
    DisplayRentalsComponent,
    DisplayTwoBedsComponent,
    DisplayOneBedsComponent,
    DisplayStudiosComponent,
    AllCategoriesComponent,
    AllAgentsComponent,
  ],
})
export class AdminLayoutModule {}
