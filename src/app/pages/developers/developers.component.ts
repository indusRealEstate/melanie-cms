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
import { DevelopersService } from "app/services/developers.service";

@Component({
  selector: "app-developers",
  templateUrl: "./developers.component.html",
  styleUrls: ["./developers.component.scss"],
})
export class DevelopersComponent implements OnInit {
  displayedColumns: string[] = ["id", "name", "short_desc", "date", "action"];

  developers: MatTableDataSource<any>;
  developersCount: any;
  isLoading: boolean = true;
  pageChangeLoading: boolean = false;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private developerService: DevelopersService,
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
        img: `https://indusre.com/images/builders/logo/${image}`,
      },
    });
  }

  ngOnInit() {
    this.developerService
      .getAllDevelopers(10, 1, "")
      .subscribe((res) => {
        console.log(res);
        this.developers = new MatTableDataSource(res.dev);
        this.developersCount = res.count;
        setTimeout(() => {
          if (this.developers != undefined) {
            this.developers.sort = this.sort;
          }
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  reloadPage() {
    this.isLoading = true;
    this.developerService
      .getAllDevelopers(10, 1, "")
      .subscribe((res) => {
        this.developers = new MatTableDataSource(res.dev);
        this.developersCount = res.count;
        setTimeout(() => {
          if (this.developers != undefined) {
            this.developers.sort = this.sort;
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

  navigateToEditDevPage(dev: any) {
    this.router.navigate(["/edit-developer"], {
      queryParams: { id: dev.id },
    });
  }
  navigateToAddNewDevPage() {
    this.router.navigate(["/add-new-developer"]);
  }

  delete(dev) {
    const dialogRef = this.dialog.open(CautionDialog, {
      width: "40rem",
      height: "17rem",
      data: {
        id: dev.id,
        title: dev.name,
        type: "dev",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.delete == true) {
        this.developerService
          .deleteDeveloper(dev.id, dev.logo, dev.main_image, dev.about_image)
          .subscribe((res) => {
            this.openSnackBar("Developer deleted successfully");
            this.reloadPage();
          });
      }
    });
  }

  pageChange(event) {
    this.pageChangeLoading = true;
    this.developerService
      .getAllDevelopers(event.pageSize, event.pageIndex + 1, "")
      .subscribe((res) => {
        this.developers = new MatTableDataSource(res.dev);
      })
      .add(() => {
        this.pageChangeLoading = false;
      });
  }
}
