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
import { PropertyListingService } from "app/services/property-listings.service";
import { last, map, tap } from "rxjs";
import * as uuid from "uuid";

@Component({
  selector: "app-property-listing",
  templateUrl: "./property-listing.component.html",
  styleUrls: ["./property-listing.component.scss"],
})
export class PropertyListingComponent implements OnInit {
  displayedColumns: string[] = [
    "id",
    "address",
    "price",
    "status",
    "category",
    "area",
    "beds",
    "action",
  ];

  allListings: MatTableDataSource<any>;
  allListingsCount: any;
  isLoading: boolean = true;

  pageChangeLoading: boolean = false;

  uploading_progress: any = 0;
  uploading: boolean = false;
  search_text: string = "";

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private achievementsService: AchievementsService,
    private listingService: PropertyListingService,
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
        img: `https://premium.indusre.com/Admin/pages/forms/uploads/property/${image}`,
      },
    });
  }

  ngOnInit() {
    this.listingService
      .getAllListings(10, 1, "")
      .subscribe((res) => {
        this.allListings = new MatTableDataSource(res.list);
        this.allListingsCount = res.count;
        setTimeout(() => {
          if (this.allListings != undefined) {
            this.allListings.sort = this.sort;
          }
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  reloadPage() {
    this.isLoading = true;
    this.listingService
      .getAllListings(10, 1, "")
      .subscribe((res) => {
        this.allListings = new MatTableDataSource(res.list);
        this.allListingsCount = res.count;
        setTimeout(() => {
          if (this.allListings != undefined) {
            this.allListings.sort = this.sort;
          }
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  searchListings() {
    if (this.search_text != "") {
      this.pageChangeLoading = true;
      this.listingService
        .getAllListings(this.paginator.pageSize, 1, this.search_text)
        .subscribe((res) => {
          this.allListings = new MatTableDataSource(res.list);
          this.allListingsCount = res.count;
          setTimeout(() => {
            if (this.allListings != undefined) {
              this.allListings.sort = this.sort;
            }
          });
        })
        .add(() => {
          this.pageChangeLoading = false;
        });
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

  editListing(l: any) {
    this.router.navigate(["/edit-listing"], {
      queryParams: {
        id: l.prop_id,
      },
    });
  }
  addNewListing() {
    this.router.navigate(["/add-new-listing"]);
  }

  delete(l) {
    const dialogRef = this.dialog.open(CautionDialog, {
      width: "40rem",
      height: "17rem",
      data: {
        id: l.prop_id,
        title: l.address,
        type: "pr",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.delete == true) {
        this.listingService
          .deleteListing(l.prop_id, l.image1)
          .subscribe((res) => {
            this.openSnackBar("Listing deleted successfully");
            this.reloadPage();
          });
      }
    });
  }

  pageChange(event) {
    this.pageChangeLoading = true;
    this.listingService
      .getAllListings(event.pageSize, event.pageIndex + 1, "")
      .subscribe((res) => {
        this.allListings = new MatTableDataSource(res.list);
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
