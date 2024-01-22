import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { AddImgDialog } from "./add-img-dialog/add-img-dialog.component";
import { AddLandingPageSliderDialog } from "./add-landing-page-slider/add-landing-page-slider.component";
import { CautionDialog } from "./caution-dialog/caution-dialog.component";
import { FooterComponent } from "./footer/footer.component";
import { ImgViewDialog } from "./img-view-dialog/img-view-dialog.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    NgxSkeletonLoaderModule,
  ],
  declarations: [
    ///////////////////////////////
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    CautionDialog,
    AddImgDialog,
    ImgViewDialog,
    AddLandingPageSliderDialog,
  ],
  exports: [
    /////////////////////////////
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    CautionDialog,
    AddImgDialog,
    ImgViewDialog,
    AddLandingPageSliderDialog,
  ],
})
export class ComponentsModule {}
