import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "add-new-video-dialog",
  styleUrls: ["./add-new-video-dialog.component.scss"],
  templateUrl: "./add-new-video-dialog.component.html",
})
export class AddNewVideoDialog implements OnInit {
  image: any = "assets/img/add-image.png";
  image_file: File;

  title: any = "";
  link: any = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddNewVideoDialog>,
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
      this.link != "" &&
      this.image != "assets/img/add-image.png"
    ) {
      this.dialogRef.close({
        img: this.image,
        file: this.image_file,
        title: this.title,
        link: this.link,
      });
    }
  }
}
