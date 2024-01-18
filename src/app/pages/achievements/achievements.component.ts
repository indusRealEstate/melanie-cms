import { LiveAnnouncer } from "@angular/cdk/a11y";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AddNewAchievementDialog } from "app/components/add-new-achievement-dialog/add-new-achievement-dialog.component";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog.component";
import { EditAchievementDialog } from "app/components/edit-achievement-dialog/edit-achievement-dialog.component";
import { ImgViewDialog } from "app/components/img-view-dialog/img-view-dialog.component";
import { AchievementsService } from "app/services/achievements.service";
import { AuthService } from "app/services/auth.service";
import { last, map, tap } from "rxjs";
import * as uuid from "uuid";

@Component({
  selector: "app-achievements",
  templateUrl: "./achievements.component.html",
  styleUrls: ["./achievements.component.scss"],
})
export class AchievementsComponent implements OnInit {
  displayedColumns: string[] = ["id", "name", "award_by", "date", "action"];

  achievements: MatTableDataSource<any>;
  achievementsCount: any;
  isLoading: boolean = true;

  pageChangeLoading: boolean = false;

  uploading_progress: any = 0;
  uploading: boolean = false;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private achievementsService: AchievementsService,
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
      height: "50rem",
      data: {
        img: `https://indusre.com/images/achievements/${image}`,
      },
    });
  }

  ngOnInit() {
    this.achievementsService
      .getAllAchievements(10, 1, "")
      .subscribe((res) => {
        this.achievements = new MatTableDataSource(res.ach);
        this.achievementsCount = res.count;
        setTimeout(() => {
          if (this.achievements != undefined) {
            this.achievements.sort = this.sort;
          }
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  reloadPage() {
    this.isLoading = true;
    this.achievementsService
      .getAllAchievements(10, 1, "")
      .subscribe((res) => {
        this.achievements = new MatTableDataSource(res.ach);
        this.achievementsCount = res.count;
        setTimeout(() => {
          if (this.achievements != undefined) {
            this.achievements.sort = this.sort;
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

  editAchievement(ach: any) {
    const dialogRef = this.dialog.open(EditAchievementDialog, {
      width: "43rem",
      height: "50rem",
      data: {
        name: ach.name,
        award_by: ach.award_by,
        date: ach.date,
        img: `https://indusre.com/images/achievements/${ach.img}`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        const d = new Date(result.date);
        // This will return an ISO string matching your local time.
        const updated_date = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          d.getHours(),
          d.getMinutes() - d.getTimezoneOffset()
        ).toISOString();

        const data = {
          name: result.name,
          award_by: result.award_by,
          date: updated_date,
        };
        this.achievementsService
          .updateAchievement(ach.id, data)
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
          formdata.append("img_name", ach.img);
          formdata.append("type", "old");

          this.achievementsService
            .updateAchievementImg(formdata)
            .pipe(
              map((event) => this.getEventMessage(event)),
              tap((message) => {
                if (message == "File is 100% uploaded.") {
                  this.uploading = false;
                  this.openSnackBar("Achievement successfully updated!");
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
  addNewAchievement() {
    const dialogRef = this.dialog.open(AddNewAchievementDialog, {
      width: "43rem",
      height: "50rem",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.uploading = true;
        const random_id = uuid.v4();
        const formdata: FormData = new FormData();

        const d = new Date(result.date);
        // This will return an ISO string matching your local time.
        const updated_date = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          d.getHours(),
          d.getMinutes() - d.getTimezoneOffset()
        ).toISOString();

        const data = {
          img: `${random_id}.${
            result.file.name.split(".")[result.file.name.split(".").length - 1]
          }`,
          name: result.name,
          award_by: result.award_by,
          date: updated_date,
        };

        formdata.append("img", result.file);
        formdata.append("img_name", `${random_id}`);
        formdata.append("type", "new");

        this.achievementsService.addNewAchievement(data).subscribe((data) => {
          console.log(data);
        });

        this.achievementsService
          .updateAchievementImg(formdata)
          .pipe(
            map((event) => this.getEventMessage(event)),
            tap((message) => {
              if (message == "File is 100% uploaded.") {
                this.uploading = false;
                this.openSnackBar("New Achievement successfully added!");
                this.reloadPage();
              }
            }),
            last()
          )
          .subscribe((v) => {});
      }
    });
  }

  delete(ach) {
    const dialogRef = this.dialog.open(CautionDialog, {
      width: "40rem",
      height: "17rem",
      data: {
        id: ach.id,
        title: ach.name,
        type: "ach",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.delete == true) {
        this.achievementsService
          .deleteAchievement(ach.id, ach.img)
          .subscribe((res) => {
            this.openSnackBar("Achievement deleted successfully");
            this.reloadPage();
          });
      }
    });
  }

  pageChange(event) {
    this.pageChangeLoading = true;
    this.achievementsService
      .getAllAchievements(event.pageSize, event.pageIndex + 1, "")
      .subscribe((res) => {
        this.achievements = new MatTableDataSource(res.ach);
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
