import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "edit-review-dialog",
  styleUrls: ["./edit-review-dialog.component.scss"],
  templateUrl: "./edit-review-dialog.component.html",
})
export class EditReviewDialog implements OnInit {
  name: any = "";
  review: any = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditReviewDialog>,
    private dialog?: MatDialog
  ) {
    this.name = data.name;
    this.review = data.review;
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  submit() {
    if (this.name != "" && this.review != "") {
      this.dialogRef.close({
        name: this.name,
        review: this.review,
      });
    }
  }
}
