import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AddNewSliderImgDialog } from "app/components/add-new-slider-img-dialog/add-new-slider-img-dialog.component";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog.component";
import { EditSliderImgDialog } from "app/components/edit-slider-img-dialog/edit-slider-img-dialog.component";
import { ImgViewDialog } from "app/components/img-view-dialog/img-view-dialog.component";
import { AuthService } from "app/services/auth.service";
import { MainSliderService } from "app/services/main-slider.service";
import { last, map, tap } from "rxjs";
import * as uuid from "uuid";

@Component({
  selector: "app-main-slider",
  templateUrl: "./main-slider.component.html",
  styleUrls: ["./main-slider.component.scss"],
})
export class MainSliderComponent implements OnInit {
  isLoading: boolean = true;

  dataSource = [];

  not_saved_order: boolean = false;

  uploading_progress: any = 0;
  uploading: boolean = false;
  constructor(
    private mainSliderServices: MainSliderService,
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
    this.mainSliderServices
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
      height: "35rem",
      data: {
        img: `https://indusre.com/main_slider/${image}`,
      },
    });
  }

  revertOrder() {
    this.isLoading = true;
    this.mainSliderServices
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
      this.mainSliderServices
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

  delete(slider) {
    const dialogRef = this.dialog.open(CautionDialog, {
      width: "40rem",
      height: "17rem",
      data: {
        id: slider.id,
        title: slider.name,
        type: "main_slider",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.delete == true) {
        this.mainSliderServices
          .deleteSlider(slider.id, slider.img)
          .subscribe((res) => {
            this.openSnackBar("Slider deleted successfully");
            this.revertOrder();
          });
      }
    });
  }

  edit(slider) {
    const dialogRef = this.dialog.open(EditSliderImgDialog, {
      width: "43rem",
      height: "40rem",
      data: {
        id: slider.id,
        name: slider.name,
        img: `https://indusre.com/main_slider/${slider.img}`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.mainSliderServices
          .updateSlider(slider.id, result.name)
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
          formdata.append("img_name", slider.img);
          formdata.append("type", "old");

          this.mainSliderServices
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

  addNewSlider() {
    const dialogRef = this.dialog.open(AddNewSliderImgDialog, {
      width: "43rem",
      height: "40rem",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.uploading = true;
        const random_id = uuid.v4();
        const formdata: FormData = new FormData();
        const data = {
          img: `${random_id}.${
            result.file.name.split(".")[result.file.name.split(".").length - 1]
          }`,
          name: result.name,
        };

        formdata.append("img", result.file);
        formdata.append("img_name", `${random_id}`);
        formdata.append("type", "new");

        this.mainSliderServices.addNewSlider(data).subscribe((data) => {
          console.log(data);
        });

        this.mainSliderServices
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
