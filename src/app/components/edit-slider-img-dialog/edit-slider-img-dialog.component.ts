import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "edit-slider-img-dialog",
  styleUrls: ["./edit-slider-img-dialog.component.scss"],
  templateUrl: "./edit-slider-img-dialog.component.html",
})
export class EditSliderImgDialog implements OnInit {
  image: any = "";
  image_file: File;

  name: any = "";
  img_changed: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditSliderImgDialog>,
    private dialog?: MatDialog
  ) {
    this.image = data.img;
    this.name = data.name;
  }

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
      this.img_changed = true;
    };
  }

  submit() {
    if (this.name != "") {
      this.dialogRef.close({
        img_changed: this.img_changed,
        file: this.image_file,
        name: this.name,
      });
    }
  }
}
