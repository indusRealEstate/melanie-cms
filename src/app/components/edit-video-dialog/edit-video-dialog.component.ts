import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "edit-video-dialog",
  styleUrls: ["./edit-video-dialog.component.scss"],
  templateUrl: "./edit-video-dialog.component.html",
})
export class EditVideoDialog implements OnInit {
  image: any = "";
  image_file: File;

  title: any = "";
  link: any = "";
  img_changed: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditVideoDialog>,
    private dialog?: MatDialog
  ) {
    this.image = data.img;
    this.title = data.title;
    this.link = data.link;
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
    if (this.title != "" && this.link != "") {
      this.dialogRef.close({
        img_changed: this.img_changed,
        file: this.image_file,
        title: this.title,
        link: this.link,
      });
    }
  }
}
