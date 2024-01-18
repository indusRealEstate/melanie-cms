import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "add-new-review-dialog",
  styleUrls: ["./add-new-review-dialog.component.scss"],
  templateUrl: "./add-new-review-dialog.component.html",
})
export class AddNewReviewDialog implements OnInit {
  name: any = "";
  review: any = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddNewReviewDialog>,
    private dialog?: MatDialog
  ) {}

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
