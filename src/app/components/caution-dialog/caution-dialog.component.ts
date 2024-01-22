import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "caution-dialog",
  styleUrls: ["./caution-dialog.component.scss"],
  templateUrl: "./caution-dialog.component.html",
})
export class CautionDialog implements OnInit {
  type: any = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CautionDialog>,
    private dialog?: MatDialog
  ) {
    this.type = data.type;
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close({
      delete: false,
    });
  }

  getNameByType(type) {
    switch (type) {
      case "pr":
        return "Listing";
      case "main_slider":
        return "Landing Page Slider";
      case "rent_slider":
        return "Rentals Slider";
      case "prj":
        return "Project";
      case "d-sales":
        return "Display Sale";
      case "d-rentals":
        return "Display Rentals";
      case "two-beds":
        return "Two Beds";
      case "one-beds":
        return "One Beds";
      case "studios":
        return "Studio";
      default:
        return "";
    }
  }

  submit() {
    this.dialogRef.close({
      delete: true,
    });
  }
}
