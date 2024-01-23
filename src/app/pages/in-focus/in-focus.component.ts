import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { SelectInFocusDialog } from "app/components/select-infocus-dialog/select-infocus-dialog.component";
import { AuthService } from "app/services/auth.service";
import { InFocusService } from "app/services/in-focus.service";
import { last, map, tap } from "rxjs";

@Component({
  selector: "app-in-focus",
  templateUrl: "./in-focus.component.html",
  styleUrls: ["./in-focus.component.scss"],
})
export class InFocusComponent implements OnInit {
  isLoading: boolean = true;

  image: any;

  pr_data: any;

  tinyMceConfig: any;

  main_header: any;
  raw_main_header: any;
  sub_header: any;
  raw_sub_header: any;
  body_text: any;
  raw_body_text: any;
  description: any;
  raw_description: any;
  old_infocus_id: any;
  current_infocus_id: any;
  area_range: any;
  raw_area_range: any;

  in_focus_change_loading: boolean = false;
  constructor(
    private inFocusServices: InFocusService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.currentUserValue) {
      this.router.navigate(["/login"]);
    }

    this.tinyMceConfig = {
      height: 500,
      // menubar: true,
      plugins: [
        "advlist",
        "autolink",
        "link",
        "image",
        "lists",
        "charmap",
        "preview",
        "anchor",
        "pagebreak",
        "searchreplace",
        "wordcount",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "emoticons",
        "template",
        "help",
      ],
      toolbar:
        "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | " +
        "bullist numlist outdent indent | link image | print preview media fullscreen | " +
        "forecolor backcolor emoticons | help",
      // plugins: [
      //   "advlist autolink lists link image charmap print preview anchor",
      //   "searchreplace visualblocks code fullscreen",
      //   "insertdatetime media table paste code help wordcount",
      //   "tinycomments mentions codesample emoticons checklist mediaembed",
      //   "casechange export formatpainter pageembed permanentpen footnotes",
      //   "advtemplate advtable advcode editimage tableofcontents mergetags",
      //   "powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss textcolor",
      // ],
      // toolbar: `undo redo | blocks fontfamily fontsize | formatselect | bold italic backcolor forecolor underline strikethrough link |
      //           align checklist numlist bullist indent outdent | emoticons charmap |
      //           image media table mergetags | lineheight | tinycomments |
      //           removeformat`,
      menubar: "file edit view insert format tools table help",
      link_default_target: "_blank",
    };
  }

  ngOnInit() {
    this.inFocusServices
      .getInFocusDetails()
      .subscribe((data) => {
        if (data) {
          console.log(data);
          this.old_infocus_id = data.prop_id;
          this.main_header = data.header;
          this.raw_main_header = data.header;
          this.sub_header = data.sub_header;
          this.raw_sub_header = data.sub_header;
          this.body_text = data.body_text;
          this.raw_body_text = data.body_text;
          this.description = data.description;
          this.raw_description = data.description;
          this.pr_data = data.pr_data;
          this.image = `https://premium.indusre.com/Admin/pages/forms/uploads/property/${data.pr_data.image1}`;

          this.current_infocus_id = data.pr_data.prop_id;
          this.area_range = data.area_range;
          this.raw_area_range = data.area_range;
        }
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "close", {
      duration: 3000,
      // panelClass: "my-custom-snackbar",
      verticalPosition: "top",
      horizontalPosition: "center",
    });
  }

  checkPopupChange() {
    if (this.old_infocus_id != this.current_infocus_id) {
      return true;
    } else if (this.main_header != this.raw_main_header) {
      return true;
    } else if (this.sub_header != this.raw_sub_header) {
      return true;
    } else if (this.body_text != this.raw_body_text) {
      return true;
    } else if (this.description != this.raw_description) {
      return true;
    } else if (this.area_range != this.raw_area_range) {
      return true;
    } else {
      return false;
    }
  }

  changeInFocus() {
    this.in_focus_change_loading = true;
    const dialogRef = this.dialog.open(SelectInFocusDialog, {
      width: "80%",
      height: "50rem",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        console.log(result);
        this.current_infocus_id = result.id;
        this.pr_data = result.data;
        this.image = `https://premium.indusre.com/Admin/pages/forms/uploads/property/${result.data.image1}`;
      }
      this.in_focus_change_loading = false;
    });
  }

  submit() {
    if (this.checkPopupChange()) {
      if (
        this.main_header != "" &&
        this.sub_header != "" &&
        this.body_text != "" &&
        this.area_range != "" &&
        this.description != ""
      ) {
        this.isLoading = true;
        const data = {
          prop_id: this.current_infocus_id,
          header: this.main_header,
          sub_header: this.sub_header,
          body_text: this.body_text,
          description: this.description,
          area_range: this.area_range,
        };

        this.inFocusServices
          .updateInFocus(1, data)
          .subscribe((res) => {
            console.log(res);
          })
          .add(() => {
            this.ngOnInit();
            this.openSnackBar("In Focus updated successfully");
          });
      }
    }
  }
}
