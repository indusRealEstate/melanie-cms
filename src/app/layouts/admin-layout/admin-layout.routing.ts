import { Routes } from "@angular/router";

import { AddNewBlogComponent } from "app/pages/add-new-blog/add-new-blog.component";
import { AddNewNewsComponent } from "app/pages/add-new-news/add-new-news.component";
import { BlogViewComponent } from "app/pages/blog-view/blog-view.component";
import { BlogsComponent } from "app/pages/blogs/blogs.component";
import { NewsViewComponent } from "app/pages/news-view/news-view.component";
import { NewsComponent } from "app/pages/news/news.component";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { MainSliderComponent } from "app/pages/main-slider/main-slider.component";
import { LoginComponent } from "app/pages/login/login.component";
import { AdBannerComponent } from "app/pages/ad-banner/ad-banner.component";
import { PopupAdComponent } from "app/pages/popup-ad/popup-ad.component";
import { TeamComponent } from "app/pages/team/team.component";
import { AddNewTeamMemberComponent } from "app/pages/add-new-team-member/add-new-team-member.component";
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
import { ReviewsComponent } from "app/pages/reviews/reviews.component";
import { PropertyListingComponent } from "app/pages/property-listing/property-listing.component";
import { AddNewListingComponent } from "app/pages/add-new-listing/add-new-listing.component";
import { EditListingComponent } from "app/pages/edit-listing/edit-listing.component";
import { LandingPageSliderComponent } from "app/pages/landing-page-slider/landing-page-slider.component";
import { ProjectsComponent } from "app/pages/projects/projects.component";

export const AdminLayoutRoutes: Routes = [
  { path: "blogs", component: BlogsComponent },
  { path: "blog-view", component: BlogViewComponent },
  { path: "add-new-blog", component: AddNewBlogComponent },
  { path: "news", component: NewsComponent },
  { path: "news-view", component: NewsViewComponent },
  { path: "add-new-news", component: AddNewNewsComponent },
  { path: "main-slider", component: MainSliderComponent },
  { path: "ad-banner", component: AdBannerComponent },
  { path: "popup-ad", component: PopupAdComponent },
  { path: "team", component: TeamComponent },
  { path: "add-new-team-member", component: AddNewTeamMemberComponent },
  { path: "edit-team-member", component: EditTeamMemberComponent },
  { path: "developers", component: DevelopersComponent },
  { path: "add-new-developer", component: AddNewDeveloperComponent },
  { path: "edit-developer", component: EditDeveloperComponent },
  { path: "videos", component: VideosComponent },
  { path: "achievements", component: AchievementsComponent },
  { path: "community-guides", component: CommunityGuidesComponent },
  { path: "add-new-guide", component: AddNewGuideComponent },
  { path: "edit-guide", component: EditGuideComponent },
  { path: "optimize-img", component: OptimizeImgComponent },
  { path: "reviews", component: ReviewsComponent },
  /////////////////////////////////////////////////////////
  ////////////////////// new routes ///////////////////////
  /////////////////////////////////////////////////////////
  { path: "login", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "property-listings", component: PropertyListingComponent },
  { path: "add-new-listing", component: AddNewListingComponent },
  { path: "edit-listing", component: EditListingComponent },
  { path: "landing-page-slider", component: LandingPageSliderComponent },
  { path: "projects", component: ProjectsComponent },
];
