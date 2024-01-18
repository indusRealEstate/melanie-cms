import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "add-new-ad-banner-dialog",
  styleUrls: ["./add-new-ad-banner-dialog.component.scss"],
  templateUrl: "./add-new-ad-banner-dialog.component.html",
})
export class AddNewAdBannerDialog implements OnInit {
  image: any = "assets/img/add-image.png";
  image_file: File;

  title: any = "";
  subtitle: any = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddNewAdBannerDialog>,
    private dialog?: MatDialog
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  handleFileInput(files: any) {
    this.image_file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.image = event.target.result;
    };
  }

  submit() {
    if (
      this.title != "" &&
      this.subtitle != "" &&
      this.image != "assets/img/add-image.png"
    ) {
      this.dialogRef.close({
        img: this.image,
        file: this.image_file,
        title: this.title,
        subtitle: this.subtitle,
      });
    }
  }
}
