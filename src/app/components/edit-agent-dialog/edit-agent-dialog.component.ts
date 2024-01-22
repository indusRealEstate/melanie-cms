import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "edit-agent-dialog",
  styleUrls: ["./edit-agent-dialog.component.scss"],
  templateUrl: "./edit-agent-dialog.component.html",
})
export class EditAgentDialog implements OnInit {
  image: any = "";
  image_file: File;
  img_changed: boolean = false;
  name: any = "";
  role: any;
  username: any = "";
  email: any = "";
  password: any = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditAgentDialog>,
    private dialog?: MatDialog
  ) {
    this.image = data.image;
    this.name = data.name;
    this.role = data.role;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  handleFileInput(files: any) {
    this.image_file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.image = event.target.result;
      this.img_changed = true;
    };
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  submit() {
    if (
      this.name != "" &&
      this.role != undefined &&
      this.username != "" &&
      this.email != "" &&
      this.password != ""
    ) {
      this.dialogRef.close({
        name: this.name,
        image_file: this.image_file,
        img_changed: this.img_changed,
        role: this.role,
        username: this.username,
        email: this.email,
        password: this.password,
      });
    }
  }
}
