import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Countries } from "app/utils/countries";

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
  phone_no: any = "";
  password: any = "";
  countries: any = [];
  countriesClass: Countries = new Countries();

  nationality: any = "";
  brn: any = "";

  description: any = "";

  language: String = "";
  selected_languages: any[] = [];

  areas: String = "";
  selected_areas: any[] = [];

  exp_since: any ;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddAgentDialog>,
    private dialog?: MatDialog
  ) {
    this.countries = this.countriesClass.all_countries;
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  addLanguage(type) {
    if (type == "l") {
      if (
        this.language != "" &&
        !this.selected_languages.includes(this.language.toLowerCase())
      ) {
        this.selected_languages.push(this.language.toLowerCase());
        this.language = "";
      }
    } else {
      if (
        this.areas != "" &&
        !this.selected_areas.includes(this.areas.toLowerCase())
      ) {
        this.selected_areas.push(this.areas.toLowerCase());
        this.areas = "";
      }
    }
  }

  removeLanguage(index, type) {
    if (type == "l") {
      this.selected_languages.splice(index, 1);
    } else {
      this.selected_areas.splice(index, 1);
    }
  }

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
      this.phone_no != "" &&
      this.password != ""
    ) {
      this.dialogRef.close({
        name: this.name,
        image_file: this.image_file,
        role: this.role,
        username: this.username,
        email: this.email,
        password: this.password,
        phone_no: this.phone_no,
        nationality: this.nationality,
        brn: this.brn,
        description: this.description,
        languages: this.selected_languages,
        areas: this.selected_areas,
        exp_since: this.exp_since,
      });
    }
  }
}
