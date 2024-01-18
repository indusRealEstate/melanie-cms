import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AddNewAdBannerDialog } from "app/components/add-new-ad-banner-dialog/add-new-ad-banner-dialog.component";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog.component";
import { EditAdBannerDialog } from "app/components/edit-ad-banner-dialog/edit-ad-banner-dialog.component";
import { ImgViewDialog } from "app/components/img-view-dialog/img-view-dialog.component";
import { AdBannerService } from "app/services/ad-banner.service";
import { AuthService } from "app/services/auth.service";
import { last, map, tap } from "rxjs";
import * as uuid from "uuid";

@Component({
  selector: "app-ad-banner",
  templateUrl: "./ad-banner.component.html",
  styleUrls: ["./ad-banner.component.scss"],
})
export class AdBannerComponent implements OnInit {
  isLoading: boolean = true;

  dataSource = [];

  not_saved_order: boolean = false;

  uploading_progress: any = 0;
  uploading: boolean = false;
  constructor(
    private adBannerServices: AdBannerService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.currentUserValue) {
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit() {
    this.adBannerServices
      .getallImages()
      .subscribe((data) => {
        this.dataSource = data;
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  enlargeImage(image) {
    const dialogRef = this.dialog.open(ImgViewDialog, {
      width: "70rem",
      height: "55rem",
      data: {
        img: image,
      },
    });
  }

  revertOrder() {
    this.isLoading = true;
    this.adBannerServices
      .getallImages()
      .subscribe((data) => {
        this.dataSource = data;
      })
      .add(() => {
        this.isLoading = false;
        this.not_saved_order = false;
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    this.not_saved_order = true;
    moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);

    let i = 1;
    this.dataSource.forEach((e) => {
      e.sort_order = i;
      i++;
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "close", {
      duration: 3000,
      // panelClass: "my-custom-snackbar",
      verticalPosition: "top",
      horizontalPosition: "center",
    });
  }

  updateSortOrder() {
    if (this.not_saved_order == true) {
      this.adBannerServices
        .updateSortOrder(this.dataSource)
        .subscribe((data) => {
          if (data) {
            this.openSnackBar("Sort order updated successfully");
          }
        })
        .add(() => {
          this.not_saved_order = false;
        });
    }
  }

  delete(banner) {
    const dialogRef = this.dialog.open(CautionDialog, {
      width: "40rem",
      height: "17rem",
      data: {
        id: banner.id,
        title: banner.title,
        type: "ad_banner",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.delete == true) {
        this.adBannerServices
          .deleteBanner(
            banner.id,
            new String(banner.image).split("banners/")[1]
          )
          .subscribe((res) => {
            this.openSnackBar("Project deleted successfully");
            this.revertOrder();
          });
      }
    });
  }

  edit(banner) {
    const dialogRef = this.dialog.open(EditAdBannerDialog, {
      width: "43rem",
      height: "45rem",
      data: {
        id: banner.id,
        title: banner.title,
        subtitle: banner.subtitle,
        img: banner.image,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.adBannerServices
          .updateBanner(banner.id, result.title, result.subtitle)
          .subscribe((data) => {})
          .add(() => {
            if (!result.img_changed) {
              this.revertOrder();
            }
          });

        if (result.img_changed) {
          this.uploading = true;
          const formdata: FormData = new FormData();
          formdata.append("img", result.file);
          formdata.append(
            "img_name",
            new String(banner.image).split("banners/")[1]
          );
          formdata.append("type", "old");

          this.adBannerServices
            .updateImg(formdata)
            .pipe(
              map((event) => this.getEventMessage(event)),
              tap((message) => {
                if (message == "File is 100% uploaded.") {
                  this.uploading = false;
                  this.openSnackBar("Image successfully updated!");
                  this.revertOrder();
                }
              }),
              last()
            )
            .subscribe((v) => {});
        }
      }
    });
  }

  addNewBanner() {
    const dialogRef = this.dialog.open(AddNewAdBannerDialog, {
      width: "43rem",
      height: "45rem",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.uploading = true;
        const random_id = uuid.v4();
        const formdata: FormData = new FormData();
        const data = {
          img: `https://www.indusre.com/mobile-app/assets/banners/${random_id}.${
            result.file.name.split(".")[result.file.name.split(".").length - 1]
          }`,
          title: result.title,
          subtitle: result.subtitle,
        };

        formdata.append("img", result.file);
        formdata.append("img_name", `${random_id}`);
        formdata.append("type", "new");

        this.adBannerServices.addNewBanner(data).subscribe((data) => {
          console.log(data);
        });

        this.adBannerServices
          .updateImg(formdata)
          .pipe(
            map((event) => this.getEventMessage(event)),
            tap((message) => {
              if (message == "File is 100% uploaded.") {
                this.uploading = false;
                this.openSnackBar("Image successfully updated!");
                this.revertOrder();
              }
            }),
            last()
          )
          .subscribe((v) => {});
      }
    });
  }

  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file `;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = event.total
          ? Math.round((100 * event.loaded) / event.total)
          : 0;

        this.uploading_progress = percentDone;
        return `File is ${percentDone}% uploaded.`;

      case HttpEventType.Response:
        this.uploading = false;
        return `File was completely uploaded!`;

      default:
        return `File surprising upload event: ${event.type}.`;
    }
  }
}
