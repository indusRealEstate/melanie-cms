import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { EditorModule } from "@tinymce/tinymce-angular";
import { AddNewBlogComponent } from "app/pages/add-new-blog/add-new-blog.component";
import { AddNewNewsComponent } from "app/pages/add-new-news/add-new-news.component";
import { BlogViewComponent } from "app/pages/blog-view/blog-view.component";
import { BlogsComponent } from "app/pages/blogs/blogs.component";
import { NewsViewComponent } from "app/pages/news-view/news-view.component";
import { NewsComponent } from "app/pages/news/news.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MainSliderComponent } from "app/pages/main-slider/main-slider.component";
import { LoginComponent } from "app/pages/login/login.component";
import { AdBannerComponent } from "app/pages/ad-banner/ad-banner.component";
import { PopupAdComponent } from "app/pages/popup-ad/popup-ad.component";
import { TeamComponent } from "app/pages/team/team.component";
import { AddNewTeamMemberComponent } from "app/pages/add-new-team-member/add-new-team-member.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { EditTeamMemberComponent } from "app/pages/edit-team-member/edit-team-member.component";
import { DevelopersComponent } from "app/pages/developers/developers.component";
import { AddNewDeveloperComponent } from "app/pages/add-new-developer/add-new-developer.component";
import { EditDeveloperComponent } from "app/pages/edit-developer/edit-developer.component";
import { VideosComponent } from "app/pages/all-videos/all-videos.component";
import { AchievementsComponent } from "app/pages/achievements/achievements.component";
import { CommunityGuidesComponent } from "app/pages/community-guides/community-guides.component";
import { AddNewGuideComponent } from "app/pages/add-new-guide/add-new-guide.component";
import { EditGuideComponent } from "app/pages/edit-guide/edit-guide.component";
import { OptimizeImgComponent } from "app/pages/optimize-img/optimize-img.component";
import { ImageCropperModule } from "ngx-image-cropper";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgxDropzoneModule } from "ngx-dropzone";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ReviewsComponent } from "app/pages/reviews/reviews.component";

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
  ],
  declarations: [
    LoginComponent,
    DashboardComponent,
    BlogsComponent,
    BlogViewComponent,
    NewsComponent,
    NewsViewComponent,
    AddNewBlogComponent,
    AddNewNewsComponent,
    MainSliderComponent,
    AdBannerComponent,
    PopupAdComponent,
    TeamComponent,
    AddNewTeamMemberComponent,
    EditTeamMemberComponent,
    DevelopersComponent,
    AddNewDeveloperComponent,
    EditDeveloperComponent,
    VideosComponent,
    AchievementsComponent,
    CommunityGuidesComponent,
    AddNewGuideComponent,
    EditGuideComponent,
    OptimizeImgComponent,
    ReviewsComponent,
  ],
})
export class AdminLayoutModule {}
