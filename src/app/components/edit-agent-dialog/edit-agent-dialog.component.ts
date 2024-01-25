import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Countries } from "app/utils/countries";

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
  phone_no: any = "";
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
    public dialogRef: MatDialogRef<EditAgentDialog>,
    private dialog?: MatDialog
  ) {
    this.countries = this.countriesClass.all_countries;
    this.image = data.image;
    this.name = data.name;
    this.role = data.role;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.phone_no = data.phone_no;
    this.exp_since = data.exp_since;

    this.nationality = data.nationality;
    this.brn = data.brn;
    this.description = data.description;
    if (data.languages != "" && data.languages != undefined) {
      this.selected_languages = JSON.parse(data.languages);
    }
    if (data.areas != "" && data.areas != undefined) {
      this.selected_areas = JSON.parse(data.areas);
    }
  }

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
      this.phone_no != "" &&
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
