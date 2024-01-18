import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog.component";
import { ImgViewDialog } from "app/components/img-view-dialog/img-view-dialog.component";
import { AuthService } from "app/services/auth.service";
import { CommunityGuidesService } from "app/services/community-guides.service";

@Component({
  selector: "app-community-guides",
  templateUrl: "./community-guides.component.html",
  styleUrls: ["./community-guides.component.scss"],
})
export class CommunityGuidesComponent implements OnInit {
  displayedColumns: string[] = ["id", "l_name", "short_desc", "action"];

  guides: MatTableDataSource<any>;
  guidesCount: any;
  isLoading: boolean = true;
  pageChangeLoading: boolean = false;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private guidesService: CommunityGuidesService,
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
        img: `https://indusre.com/communityimg/${image}`,
      },
    });
  }

  ngOnInit() {
    this.guidesService
      .getAllGuides(10, 1, "")
      .subscribe((res) => {
        this.guides = new MatTableDataSource(res.gd);
        this.guidesCount = res.count;
        setTimeout(() => {
          if (this.guides != undefined) {
            this.guides.sort = this.sort;
          }
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  reloadPage() {
    this.isLoading = true;
    this.guidesService
      .getAllGuides(10, 1, "")
      .subscribe((res) => {
        this.guides = new MatTableDataSource(res.gd);
        this.guidesCount = res.count;
        setTimeout(() => {
          if (this.guides != undefined) {
            this.guides.sort = this.sort;
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

  navigateToEditDevPage(g: any) {
    this.router.navigate(["/edit-guide"], {
      queryParams: { id: g.ps_guide_id },
    });
  }
  navigateToAddNewDevPage() {
    this.router.navigate(["/add-new-guide"]);
  }

  delete(guide) {
    const dialogRef = this.dialog.open(CautionDialog, {
      width: "40rem",
      height: "17rem",
      data: {
        title: guide.location_name,
        type: "guide",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.delete == true) {
        this.guidesService
          .deleteGuide(guide.ps_guide_id, guide.location_image)
          .subscribe((res) => {})
          .add(() => {
            this.openSnackBar("Community guide deleted successfully");
            this.reloadPage();
          });
      }
    });
  }

  pageChange(event) {
    this.pageChangeLoading = true;
    this.guidesService
      .getAllGuides(event.pageSize, event.pageIndex + 1, "")
      .subscribe((res) => {
        this.guides = new MatTableDataSource(res.gd);
      })
      .add(() => {
        this.pageChangeLoading = false;
      });
  }
}
