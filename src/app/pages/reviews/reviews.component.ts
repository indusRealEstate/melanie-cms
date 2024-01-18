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
import { AddNewReviewDialog } from "app/components/add-new-review-dialog/add-new-review-dialog.component";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog.component";
import { EditAchievementDialog } from "app/components/edit-achievement-dialog/edit-achievement-dialog.component";
import { EditReviewDialog } from "app/components/edit-review-dialog/edit-review-dialog.component";
import { ImgViewDialog } from "app/components/img-view-dialog/img-view-dialog.component";
import { AuthService } from "app/services/auth.service";
import { ReviewsService } from "app/services/reviews.service";
import { last, map, tap } from "rxjs";
import * as uuid from "uuid";

@Component({
  selector: "app-reviews",
  templateUrl: "./reviews.component.html",
  styleUrls: ["./reviews.component.scss"],
})
export class ReviewsComponent implements OnInit {
  displayedColumns: string[] = ["id", "name", "review", "date", "action"];

  reviews: MatTableDataSource<any>;
  reviewsCount: any;
  isLoading: boolean = true;

  pageChangeLoading: boolean = false;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private reviewService: ReviewsService,
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
        img: `https://indusre.com/images/reviews/${image}`,
      },
    });
  }

  ngOnInit() {
    this.reviewService
      .getAllReviews(10, 1, "")
      .subscribe((res) => {
        this.reviews = new MatTableDataSource(res.ach);
        this.reviewsCount = res.count;
        setTimeout(() => {
          if (this.reviews != undefined) {
            this.reviews.sort = this.sort;
          }
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  reloadPage() {
    this.isLoading = true;
    this.reviewService
      .getAllReviews(10, 1, "")
      .subscribe((res) => {
        this.reviews = new MatTableDataSource(res.ach);
        this.reviewsCount = res.count;
        setTimeout(() => {
          if (this.reviews != undefined) {
            this.reviews.sort = this.sort;
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

  editReview(r: any) {
    const dialogRef = this.dialog.open(EditReviewDialog, {
      width: "43rem",
      height: "26rem",
      data: {
        name: r.name,
        review: r.review,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        const data = {
          name: result.name,
          review: result.review,
        };
        this.reviewService
          .updateReview(r.id, data)
          .subscribe((data) => {})
          .add(() => {
            this.reloadPage();
          });
      }
    });
  }
  addNewReview() {
    const dialogRef = this.dialog.open(AddNewReviewDialog, {
      width: "43rem",
      height: "26rem",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        const data = {
          name: result.name,
          review: result.review,
        };

        this.reviewService
          .addNewReview(data)
          .subscribe((data) => {
            console.log(data);
          })
          .add(() => {
            this.reloadPage();
            this.openSnackBar("Review added successfully");
          });
      }
    });
  }

  delete(r) {
    const dialogRef = this.dialog.open(CautionDialog, {
      width: "40rem",
      height: "17rem",
      data: {
        id: r.id,
        title: r.name,
        type: "review",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.delete == true) {
        this.reviewService.deleteReview(r.id).subscribe((res) => {
          this.openSnackBar("Review deleted successfully");
          this.reloadPage();
        });
      }
    });
  }

  pageChange(event) {
    this.pageChangeLoading = true;
    this.reviewService
      .getAllReviews(event.pageSize, event.pageIndex + 1, "")
      .subscribe((res) => {
        this.reviews = new MatTableDataSource(res.ach);
      })
      .add(() => {
        this.pageChangeLoading = false;
      });
  }
}
