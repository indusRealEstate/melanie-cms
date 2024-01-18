import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { CautionDialog } from "./caution-dialog/caution-dialog.component";
import { AddImgDialog } from "./add-img-dialog/add-img-dialog.component";
import { MatIconModule } from "@angular/material/icon";
import { AddNewSliderImgDialog } from "./add-new-slider-img-dialog/add-new-slider-img-dialog.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditSliderImgDialog } from "./edit-slider-img-dialog/edit-slider-img-dialog.component";
import { AddNewAdBannerDialog } from "./add-new-ad-banner-dialog/add-new-ad-banner-dialog.component";
import { EditAdBannerDialog } from "./edit-ad-banner-dialog/edit-ad-banner-dialog.component";
import { AddNewVideoDialog } from "./add-new-video-dialog/add-new-video-dialog.component";
import { EditVideoDialog } from "./edit-video-dialog/edit-video-dialog.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { AddNewAchievementDialog } from "./add-new-achievement-dialog/add-new-achievement-dialog.component";
import { EditAchievementDialog } from "./edit-achievement-dialog/edit-achievement-dialog.component";
import { ImgViewDialog } from "./img-view-dialog/img-view-dialog.component";
import { AddNewGuideHighlightDialog } from "./add-new-guide-highlight-dialog/add-new-guide-highlight-dialog.component";
import { AddNewReviewDialog } from "./add-new-review-dialog/add-new-review-dialog.component";
import { EditReviewDialog } from "./edit-review-dialog/edit-review-dialog.component";

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
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    CautionDialog,
    AddImgDialog,
    AddNewSliderImgDialog,
    EditSliderImgDialog,
    AddNewAdBannerDialog,
    EditAdBannerDialog,
    AddNewVideoDialog,
    EditVideoDialog,
    AddNewAchievementDialog,
    EditAchievementDialog,
    ImgViewDialog,
    AddNewGuideHighlightDialog,
    AddNewReviewDialog,
    EditReviewDialog,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    CautionDialog,
    AddImgDialog,
    AddNewSliderImgDialog,
    EditSliderImgDialog,
    AddNewAdBannerDialog,
    EditAdBannerDialog,
    AddNewVideoDialog,
    EditVideoDialog,
    AddNewAchievementDialog,
    EditAchievementDialog,
    ImgViewDialog,
    AddNewGuideHighlightDialog,
    AddNewReviewDialog,
    EditReviewDialog,
  ],
})
export class ComponentsModule {}
