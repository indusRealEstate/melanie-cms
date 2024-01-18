import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AuthService } from "app/services/auth.service";
import { BlogsService } from "app/services/blog.service";

import { Countries } from "../../utils/countries";
import { TeamService } from "app/services/team.service";
import * as uuid from "uuid";
import { last, map, tap } from "rxjs";

@Component({
  selector: "app-add-new-team-member",
  templateUrl: "./add-new-team-member.component.html",
  styleUrls: ["./add-new-team-member.component.scss"],
})
export class AddNewTeamMemberComponent implements OnInit {
  member_name: any = "";
  member_email: any = "";
  member_phone: any = "";
  member_phone_alt: any = "";
  member_designation: any = "";
  member_role: any = "";
  member_nationality: any = "";
  member_brn_no: any = "";
  member_exp_since: any = "";
  member_cover_area: any = "";
  member_linkedin_link: any = "";
  member_bio: any = "";

  uploading_progress: any = 0;
  uploading: boolean = false;
  saving: boolean = false;

  countries: any = [];

  profile_img: any = "assets/img/svg/team.svg";
  profile_img_file: File;

  langulages: any[] = [
    "English",
    "Hindi",
    "Tagalog",
    "Urdu",
    "Malayalam",
    "Tamil",
    "Spanish",
    "Chinese",
    "Russian",
  ];
  selected_langulages: any[] = [];

  countriesClass: Countries = new Countries();
  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private teamService: TeamService,
    private authService: AuthService,
    private router: Router
  ) {
    this.countries = this.countriesClass.all_countries;
    if (!this.authService.currentUserValue) {
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit() {}

  handleFileInput(files: any) {
    this.profile_img_file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.profile_img = event.target.result;
    };
  }

  displaySelectedLanguages() {
    if (this.selected_langulages.length == 0) {
      return "Select Languages";
    } else {
      return this.selected_langulages.join(", ");
    }
  }

  languageSelect(event: any) {
    if (this.selected_langulages.includes(event)) {
      this.selected_langulages.splice(
        this.selected_langulages.indexOf(event),
        1
      );
    } else {
      this.selected_langulages.push(event);
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "close", {
      duration: 3000,
      // panelClass: "my-custom-snackbar",
      verticalPosition: "top",
      horizontalPosition: "center",
    });
  }

  save() {
    if (
      this.member_name != "" &&
      this.member_email != "" &&
      this.member_phone != "" &&
      this.member_designation != "" &&
      this.member_role != ""
    ) {
      const random_id = uuid.v4();
      const formdata: FormData = new FormData();
      this.saving = true;
      var data = {
        user_name: this.member_name,
        user_mail: this.member_email,
        user_phone: this.member_phone,
        user_phone_alt: this.member_phone_alt,
        user_type: this.member_role,
        user_designation: this.member_designation,
        user_nationality: this.member_nationality,
        user_languages: this.selected_langulages.join(","),
        user_brn_no: this.member_brn_no,
        user_exp_since: this.member_exp_since,
        user_linkedin: this.member_linkedin_link,
        user_cover_area: this.member_cover_area,
        user_bio: this.member_bio,
        user_img: `${random_id}.${
          this.profile_img_file.name.split(".")[
            this.profile_img_file.name.split(".").length - 1
          ]
        }`,
      };
      this.teamService
        .addNewMember(data)
        .subscribe((res) => {
          console.log(res);
        })
        .add(() => {
          this.saving = false;
          this.openSnackBar("Member successfully added!");
        });
      formdata.append("img", this.profile_img_file);
      formdata.append("img_name", random_id);
      formdata.append("type", "new");
      this.uploading = true;
      this.teamService
        .updateMemberImg(formdata)
        .pipe(
          map((event) => this.getEventMessage(event)),
          tap((message) => {
            if (message == "File is 100% uploaded.") {
              this.uploading = false;
              this.openSnackBar("Profile image successfully updated!");
              setTimeout(() => {
                this.router.navigate(["/team"]);
              }, 500);
            }
          }),
          last()
        )
        .subscribe((v) => {});
    }
  }

  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file `;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = event.total
          ? Math.round((100 * event.loaded) / event.total)
          : 0;

        this.uploading_progress = percentDone;
        return `File is ${percentDone}% uploaded.`;

      case HttpEventType.Response:
        this.uploading = false;
        return `File was completely uploaded!`;

      default:
        return `File surprising upload event: ${event.type}.`;
    }
  }
}
