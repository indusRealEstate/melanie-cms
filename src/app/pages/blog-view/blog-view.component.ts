import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { BlogsService } from "app/services/blog.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { last, map, tap } from "rxjs";
import { AddImgDialog } from "app/components/add-img-dialog/add-img-dialog.component";
import { AuthService } from "app/services/auth.service";

@Component({
  selector: "app-blog-view",
  templateUrl: "./blog-view.component.html",
  styleUrls: ["./blog-view.component.scss"],
})
export class BlogViewComponent implements OnInit {
  blog_id: any;
  isLoading: boolean = true;
  blogData: any;
  tinyMceConfig: any;

  main_img: any = "";
  main_img_file: File;
  thumbnail_img: any = "";
  thumbnail_img_file: File;

  blog_title: string = "";

  saving: boolean = false;

  uploading_progress: any = 0;
  uploading: boolean = false;
  constructor(
    private readonly route: ActivatedRoute,
    private blogsService: BlogsService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.currentUserValue) {
      this.router.navigate(["/login"]);
    }

    this.route.queryParams.subscribe((res) => {
      this.blog_id = res.id;
    });

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
    this.blogsService
      .getBlogDetails(this.blog_id)
      .subscribe((res) => {
        console.log(res);
        this.blogData = res;
        this.thumbnail_img = `https://indusre.com/blogsimg/${res.blogs_thumbnail}`;
        this.main_img = `https://indusre.com/blogsimg/${res.blogs_mainimage}`;
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  preview() {
    window.open(`https://indusre.com/blog/${this.blog_id}`, "_blank");
  }

  editImg(img, type): void {
    const dialogRef = this.dialog.open(AddImgDialog, {
      width: "40rem",
      height: "34rem",
      data: img,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (type == "thumbnail") {
          this.thumbnail_img = result.img;
          this.thumbnail_img_file = result.file;
        } else {
          this.main_img = result.img;
          this.main_img_file = result.file;
        }
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
    const formdata: FormData = new FormData();
    let updating_imgs: number = 0;
    this.saving = true;

    var data = {
      title: this.blogData.blogs_title,
      date: new Date(),
      desc: this.blogData.blogs_description,
    };

    this.blogsService
      .updateBlog(this.blog_id, data)
      .subscribe((res) => {
        console.log(res);
      })
      .add(() => {
        this.saving = false;
        this.openSnackBar("Blog successfully edited!");
      });

    if (new String(this.main_img).startsWith("data")) {
      formdata.append("img", this.main_img_file);
      formdata.append("img_name", this.blogData.blogs_mainimage);
      updating_imgs++;
    }

    if (new String(this.thumbnail_img).startsWith("data")) {
      formdata.append("thumb_img", this.thumbnail_img_file);
      formdata.append("thumb_img_name", this.blogData.blogs_thumbnail);
      updating_imgs++;
    }

    if (updating_imgs > 0) {
      formdata.append("type", "old");
      this.uploading = true;
      console.log("imgs edited..");
      this.openSnackBar(`Blog image updating ${this.uploading_progress}%`);
      this.blogsService
        .updateBlogImg(formdata)
        .pipe(
          map((event) => this.getEventMessage(event)),
          tap((message) => {}),
          last()
        )
        .subscribe((v) => {
          if (this.uploading_progress == 100) {
            this.openSnackBar("Blog image successfully updated!");
          }
        });
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
