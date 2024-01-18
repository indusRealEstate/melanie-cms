import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AddImgDialog } from "app/components/add-img-dialog/add-img-dialog.component";
import { AuthService } from "app/services/auth.service";
import { NewsService } from "app/services/news.service";
import { last, map, tap } from "rxjs";
import * as uuid from "uuid";

@Component({
  selector: "app-add-new-news",
  templateUrl: "./add-new-news.component.html",
  styleUrls: ["./add-new-news.component.scss"],
})
export class AddNewNewsComponent implements OnInit {
  tinyMceConfig: any;
  blog_desc: any = "";
  blog_title: any = "";

  uploading_progress: any = 0;
  uploading: boolean = false;
  saving: boolean = false;

  thumbnail_img: any = "assets/img/add-image.png";
  main_img: any = "assets/img/add-image.png";

  main_img_file: File;
  thumbnail_img_file: File;
  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private newsService: NewsService,
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

  ngOnInit() {}

  editImg(img, type): void {
    const dialogRef = this.dialog.open(AddImgDialog, {
      width: "40rem",
      height: "34rem",
      data: img,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (type == "thumbnail") {
        this.thumbnail_img = result.img;
        this.thumbnail_img_file = result.file;
      } else {
        this.main_img = result.img;
        this.main_img_file = result.file;
      }
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

  save() {
    if (
      this.blog_title != "" &&
      this.blog_desc != "" &&
      this.main_img != "assets/img/add-image.png" &&
      this.thumbnail_img != "assets/img/add-image.png"
    ) {
      const blog_id = uuid.v4();
      const formdata: FormData = new FormData();
      this.saving = true;

      var data = {
        title: this.blog_title,
        date: new Date(),
        desc: this.blog_desc,
        thumbnail: `${blog_id}_thumbnail.${
          this.thumbnail_img_file.name.split(".")[
            this.thumbnail_img_file.name.split(".").length - 1
          ]
        }`,
        mainImg: `${blog_id}_main.${
          this.main_img_file.name.split(".")[
            this.main_img_file.name.split(".").length - 1
          ]
        }`,
      };

      this.newsService
        .addNewNews(data)
        .subscribe((res) => {
          console.log(res);
        })
        .add(() => {
          this.saving = false;
          this.openSnackBar("Blog successfully added!");
        });

      formdata.append("img", this.main_img_file);
      formdata.append("img_name", `${blog_id}_main`);
      formdata.append("thumb_img", this.thumbnail_img_file);
      formdata.append("thumb_img_name", `${blog_id}_thumbnail`);

      formdata.append("type", "new");

      this.uploading = true;
      this.openSnackBar(`Blog image updating ${this.uploading_progress}%`);
      this.newsService
        .updateNewsImg(formdata)
        .pipe(
          map((event) => this.getEventMessage(event)),
          tap((message) => {
            if (message == "File is 100% uploaded.") {
              this.uploading = false;
              this.openSnackBar("Blog image successfully updated!");
              setTimeout(() => {
                this.router.navigate(["/news"]);
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
