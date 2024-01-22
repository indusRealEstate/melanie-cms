import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "add-agent-dialog",
  styleUrls: ["./add-agent-dialog.component.scss"],
  templateUrl: "./add-agent-dialog.component.html",
})
export class AddAgentDialog implements OnInit {
  image: any = "assets/img/add-image.png";
  image_file: File;
  name: any = "";
  role: any;
  username: any = "";
  email: any = "";
  password: any = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddAgentDialog>,
    private dialog?: MatDialog
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  handleFileInput(files: any) {
    this.image_file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.image = event.target.result;
    };
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  submit() {
    if (
      this.image != "assets/img/add-image.png" &&
      this.name != "" &&
      this.role != undefined &&
      this.username != "" &&
      this.email != "" &&
      this.password != ""
    ) {
      this.dialogRef.close({
        name: this.name,
        image_file: this.image_file,
        role: this.role,
        username: this.username,
        email: this.email,
        password: this.password,
      });
    }
  }
}
