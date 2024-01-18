import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "add-new-achievement-dialog",
  styleUrls: ["./add-new-achievement-dialog.component.scss"],
  templateUrl: "./add-new-achievement-dialog.component.html",
})
export class AddNewAchievementDialog implements OnInit {
  image: any = "assets/img/add-image.png";
  image_file: File;

  name: any = "";
  award_by: any = "";
  date: any = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddNewAchievementDialog>,
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
    if (
      this.name != "" &&
      this.award_by != "" &&
      this.date != "" &&
      this.image != "assets/img/add-image.png"
    ) {
      this.dialogRef.close({
        img: this.image,
        file: this.image_file,
        name: this.name,
        award_by: this.award_by,
        date: this.date,
      });
    }
  }
}
