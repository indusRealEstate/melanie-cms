import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "add-category-dialog",
  styleUrls: ["./add-category-dialog.component.scss"],
  templateUrl: "./add-category-dialog.component.html",
})
export class AddCategoryDialog implements OnInit {
  name: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddCategoryDialog>,
    private dialog?: MatDialog
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close({ name: this.name });
  }
}
