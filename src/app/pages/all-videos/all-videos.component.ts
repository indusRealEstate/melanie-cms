import { LiveAnnouncer } from "@angular/cdk/a11y";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AddNewVideoDialog } from "app/components/add-new-video-dialog/add-new-video-dialog.component";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog.component";
import { EditVideoDialog } from "app/components/edit-video-dialog/edit-video-dialog.component";
import { ImgViewDialog } from "app/components/img-view-dialog/img-view-dialog.component";
import { AuthService } from "app/services/auth.service";
import { VideoService } from "app/services/videos.service";
import { last, map, tap } from "rxjs";
import * as uuid from "uuid";

@Component({
  selector: "app-videos",
  templateUrl: "./all-videos.component.html",
  styleUrls: ["./all-videos.component.scss"],
})
export class VideosComponent implements OnInit {
  displayedColumns: string[] = ["id", "title", "img", "date", "action"];

  videos: MatTableDataSource<any>;
  videosCount: any;
  isLoading: boolean = true;

  pageChangeLoading: boolean = false;

  uploading_progress: any = 0;
  uploading: boolean = false;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private videoService: VideoService,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    if (!this.authService.currentUserValue) {
      this.router.navigate(["/login"]);
    }
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {}

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  enlargeImage(image) {
    const dialogRef = this.dialog.open(ImgViewDialog, {
      width: "65rem",
      height: "45rem",
      data: {
        img: `https://indusre.com/images/videos/${image}`,
      },
    });
  }

  ngOnInit() {
    this.videoService
      .getAllVideos(10, 1, "")
      .subscribe((res) => {
        this.videos = new MatTableDataSource(res.videos);
        this.videosCount = res.count;
        setTimeout(() => {
          if (this.videos != undefined) {
            this.videos.sort = this.sort;
          }
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  reloadPage() {
    this.isLoading = true;
    this.videoService
      .getAllVideos(10, 1, "")
      .subscribe((res) => {
        this.videos = new MatTableDataSource(res.videos);
        this.videosCount = res.count;
        setTimeout(() => {
          if (this.videos != undefined) {
            this.videos.sort = this.sort;
          }
        });
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

  editVideo(video: any) {
    const dialogRef = this.dialog.open(EditVideoDialog, {
      width: "43rem",
      height: "45rem",
      data: {
        id: video.video_id,
        title: video.video_title,
        link: video.video_link,
        img: `https://indusre.com/images/videos/${video.video_image}`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        const data = {
          title: result.title,
          link: result.link,
        };
        this.videoService
          .updateVideo(video.video_id, data)
          .subscribe((data) => {})
          .add(() => {
            if (!result.img_changed) {
              this.reloadPage();
            }
          });

        if (result.img_changed) {
          this.uploading = true;
          const formdata: FormData = new FormData();
          formdata.append("img", result.file);
          formdata.append("img_name", video.video_image);
          formdata.append("type", "old");

          this.videoService
            .updateVideoImg(formdata)
            .pipe(
              map((event) => this.getEventMessage(event)),
              tap((message) => {
                if (message == "File is 100% uploaded.") {
                  this.uploading = false;
                  this.openSnackBar("Image successfully updated!");
                  this.reloadPage();
                }
              }),
              last()
            )
            .subscribe((v) => {});
        }
      }
    });
  }
  addNewVideo() {
    const dialogRef = this.dialog.open(AddNewVideoDialog, {
      width: "43rem",
      height: "45rem",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.uploading = true;
        const random_id = uuid.v4();
        const formdata: FormData = new FormData();
        const data = {
          img: `${random_id}.${
            result.file.name.split(".")[result.file.name.split(".").length - 1]
          }`,
          title: result.title,
          link: result.link,
        };

        formdata.append("img", result.file);
        formdata.append("img_name", `${random_id}`);
        formdata.append("type", "new");

        this.videoService.addNewVideo(data).subscribe((data) => {
          console.log(data);
        });

        this.videoService
          .updateVideoImg(formdata)
          .pipe(
            map((event) => this.getEventMessage(event)),
            tap((message) => {
              if (message == "File is 100% uploaded.") {
                this.uploading = false;
                this.openSnackBar("Image successfully updated!");
                this.reloadPage();
              }
            }),
            last()
          )
          .subscribe((v) => {});
      }
    });
  }

  delete(video) {
    const dialogRef = this.dialog.open(CautionDialog, {
      width: "40rem",
      height: "17rem",
      data: {
        id: video.video_id,
        title: video.video_title,
        type: "video",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.delete == true) {
        this.videoService
          .deleteVideo(video.video_id, video.video_image)
          .subscribe((res) => {
            this.openSnackBar("Video deleted successfully");
            this.reloadPage();
          });
      }
    });
  }

  pageChange(event) {
    this.pageChangeLoading = true;
    this.videoService
      .getAllVideos(event.pageSize, event.pageIndex + 1, "")
      .subscribe((res) => {
        this.videos = new MatTableDataSource(res.videos);
      })
      .add(() => {
        this.pageChangeLoading = false;
      });
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
