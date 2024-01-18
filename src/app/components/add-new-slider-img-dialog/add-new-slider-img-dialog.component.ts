import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "add-new-slider-img-dialog",
  styleUrls: ["./add-new-slider-img-dialog.component.scss"],
  templateUrl: "./add-new-slider-img-dialog.component.html",
})
export class AddNewSliderImgDialog implements OnInit {
  image: any = "assets/img/add-image.png";
  image_file: File;

  name: any = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddNewSliderImgDialog>,
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
    if (this.name != "" && this.image != "assets/img/add-image.png") {
      this.dialogRef.close({
        img: this.image,
        file: this.image_file,
        name: this.name,
      });
    }
  }
}
