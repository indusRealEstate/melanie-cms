import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AddImgDialog } from "app/components/add-img-dialog/add-img-dialog.component";
import { AddNewGuideHighlightDialog } from "app/components/add-new-guide-highlight-dialog/add-new-guide-highlight-dialog.component";
import { AuthService } from "app/services/auth.service";
import { CommunityGuidesService } from "app/services/community-guides.service";
import { Locations } from "app/utils/locations";
import { last, map, tap } from "rxjs";

import * as uuid from "uuid";

@Component({
  selector: "app-add-new-guide",
  templateUrl: "./add-new-guide.component.html",
  styleUrls: ["./add-new-guide.component.scss"],
})
export class AddNewGuideComponent implements OnInit {
  uploading_progress: any = 0;
  uploading: boolean = false;
  saving: boolean = false;

  main_img: any = "assets/img/add-image.png";
  main_img_file: File;

  gallary_imgs_files: File[] = [];
  gallary_imgs: any[] = [];

  locations: any[] = [];

  selected_location: any;
  short_desc: any = "";
  long_desc: any = "";

  locationClass: Locations = new Locations();
  tinyMceConfig: any;

  highlights: any[] = [];

  ext_url: any = "";

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private guidesService: CommunityGuidesService,
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.currentUserValue) {
      this.router.navigate(["/login"]);
    }

    this.locations = this.locationClass.all_locations;

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

  ngOnInit() {}

  handleFileInputGallary(files: FileList) {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      this.gallary_imgs_files.push(file);
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.gallary_imgs.push(event.target.result);
      };
    });
  }

  removeAllGallaryimgs() {
    this.gallary_imgs.length = 0;
    this.gallary_imgs_files.length = 0;
  }

  removeGallaryImg(index: any) {
    this.gallary_imgs_files.splice(index, 1);
    this.gallary_imgs.splice(index, 1);
  }

  editImg(img, type): void {
    const dialogRef = this.dialog.open(AddImgDialog, {
      width: "40rem",
      height: "34rem",
      data: img,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.main_img = result.img;
      this.main_img_file = result.file;
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

  addHighlight() {
    const dialogRef = this.dialog.open(AddNewGuideHighlightDialog, {
      width: "43rem",
      height: "45rem",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        console.log(result);
        this.highlights.push(result);
      }
    });
  }

  removeHighLight(index: any) {
    this.highlights.splice(index, 1);
  }

  save() {
    if (
      this.selected_location != "" &&
      this.short_desc != "" &&
      this.long_desc != "" &&
      this.main_img != "assets/img/add-image.png" &&
      this.gallary_imgs.length != 0 &&
      this.highlights.length != 0
    ) {
      const random_id = uuid.v4();
      const formdata: FormData = new FormData();
      this.saving = true;
      this.uploading = true;

      const gallary_imgs = this.gallary_imgs_files.map(
        (f, i) =>
          `${random_id}_g_${i}.${
            f.name.split(".")[f.name.split(".").length - 1]
          }`
      );

      const highlights_imgs = this.highlights.map(
        (h, i) =>
          `${random_id}_h_${i}.${
            h.file.name.split(".")[h.file.name.split(".").length - 1]
          }`
      );
      const data = {
        l_id: this.selected_location,
        short_desc: this.short_desc,
        long_desc: this.long_desc,
        ext_url: this.ext_url,
        main_img: `${random_id}_main.${
          this.main_img_file.name.split(".")[
            this.main_img_file.name.split(".").length - 1
          ]
        }`,
        gallary_imgs: gallary_imgs,

        highlights: this.highlights.map((h, i) => {
          return {
            title: h.title,
            subtitle: h.subtitle,
            img: `${random_id}_h_${i}.${
              h.file.name.split(".")[h.file.name.split(".").length - 1]
            }`,
          };
        }),
      };

      this.guidesService.addNewGuide(data).subscribe((res) => {
        console.log(res);
      });

      formdata.append("main_img", this.main_img_file);
      formdata.append("main_img_name", `${random_id}_main`);

      formdata.append("g_img_names", JSON.stringify(gallary_imgs));
      formdata.append("h_img_names", JSON.stringify(highlights_imgs));

      this.gallary_imgs_files.forEach((f, i) => {
        formdata.append(`g_img_${i}`, f);
      });

      this.highlights.forEach((h, i) => {
        formdata.append(`h_img_${i}`, h.file);
      });

      formdata.append("type", "new");

      this.guidesService
        .updateGuideImg(formdata)
        .pipe(
          map((event) => this.getEventMessage(event)),
          tap((message) => {
            if (message == "File is 100% uploaded.") {
              this.uploading = false;
              this.openSnackBar("Community guide successfully added!");
              setTimeout(() => {
                this.router.navigate(["/community-guides"]);
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
