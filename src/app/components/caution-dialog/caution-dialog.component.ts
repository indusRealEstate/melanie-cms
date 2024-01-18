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
      case "blog":
        return "Blog";
      case "news":
        return "News";
      case "main_slider":
        return "Main Slider";
      case "ad_banner":
        return "Featured Project";
      case "team":
        return "Team Member";
      case "dev":
        return "Developer";
      case "video":
        return "Video";
      case "ach":
        return "Achievement";
      case "guide":
        return "Community Guide";
      case "review":
        return "Review";
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
