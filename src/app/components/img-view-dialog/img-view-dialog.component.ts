import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "img-view-dialog",
  styleUrls: ["./img-view-dialog.component.scss"],
  templateUrl: "./img-view-dialog.component.html",
})
export class ImgViewDialog implements OnInit {
  img: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ImgViewDialog>,
    private dialog?: MatDialog
  ) {
    this.img = data.img;
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }
}
