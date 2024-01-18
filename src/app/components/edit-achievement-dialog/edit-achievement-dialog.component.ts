import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "edit-achievement-dialog",
  styleUrls: ["./edit-achievement-dialog.component.scss"],
  templateUrl: "./edit-achievement-dialog.component.html",
})
export class EditAchievementDialog implements OnInit {
  image: any = "";
  image_file: File;

  name: any = "";
  award_by: any = "";
  date: any = "";
  img_changed: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditAchievementDialog>,
    private dialog?: MatDialog
  ) {
    this.image = data.img;
    this.name = data.name;
    this.award_by = data.award_by;
    this.date = data.date;
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
    if (this.name != "" && this.award_by != "" && this.date != "") {
      this.dialogRef.close({
        img: this.image,
        file: this.image_file,
        name: this.name,
        award_by: this.award_by,
        date: this.date,
        img_changed: this.img_changed,
      });
    }
  }
}
