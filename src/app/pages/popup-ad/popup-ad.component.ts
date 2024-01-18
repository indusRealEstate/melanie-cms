import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AuthService } from "app/services/auth.service";
import { PopupAdService } from "app/services/popup-ad.service";
import { last, map, tap } from "rxjs";

@Component({
  selector: "app-popup-ad",
  templateUrl: "./popup-ad.component.html",
  styleUrls: ["./popup-ad.component.scss"],
})
export class PopupAdComponent implements OnInit {
  isLoading: boolean = true;

  uploading_progress: any = 0;
  uploading: boolean = false;

  image: any = "";
  image_file: File;

  title: any = "";
  raw_title: any = "";

  raw_img: any = "";

  popup_change_detected: boolean = false;
  img_changed: boolean = false;
  constructor(
    private popupAdServices: PopupAdService,
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
    this.popupAdServices.getPopupAd().subscribe((data) => {
      if (data) {
        this.isLoading = false;
        this.title = data.title;
        this.raw_title = data.title;
        this.raw_img = data.img;
        this.image = `https://indusre.com/popup_ad/${data.img}`;
      }
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

  handleFileInput(files: any) {
    this.image_file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.image = event.target.result;
      this.popup_change_detected = true;
      this.img_changed = true;
    };
  }

  checkPopupChange() {
    if (this.popup_change_detected) {
      return true;
    } else if (this.title != this.raw_title) {
      return true;
    } else {
      return false;
    }
  }

  submit() {
    if (this.title != "") {
      if (this.checkPopupChange()) {
        this.popupAdServices
          .updatePopupAd(
            1,
            this.title,
            this.img_changed
              ? `popup_ad.${
                  this.image_file.name.split(".")[
                    this.image_file.name.split(".").length - 1
                  ]
                }`
              : this.raw_img
          )
          .subscribe((data) => {
            this.openSnackBar("Popup Ad Updated Successfully");
            this.popup_change_detected = false;
          });

        if (this.img_changed) {
          this.uploading = true;
          const formdata: FormData = new FormData();
          formdata.append("img", this.image_file);
          formdata.append("img_name", "popup_ad");

          this.popupAdServices
            .updateImg(formdata)
            .pipe(
              map((event) => this.getEventMessage(event)),
              tap((message) => {
                if (message == "File is 100% uploaded.") {
                  this.uploading = false;
                  this.openSnackBar("Image successfully updated!");
                }
              }),
              last()
            )
            .subscribe((v) => {});
        }
      }
    }
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
