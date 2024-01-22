import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AddCategoryDialog } from "app/components/add-category-dialog/add-category-dialog.component";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog.component";
import { ImgViewDialog } from "app/components/img-view-dialog/img-view-dialog.component";
import { AllCategoriesService } from "app/services/all-categories.service";
import { AuthService } from "app/services/auth.service";

@Component({
  selector: "app-all-categories",
  templateUrl: "./all-categories.component.html",
  styleUrls: ["./all-categories.component.scss"],
})
export class AllCategoriesComponent implements OnInit {
  displayedColumns: string[] = ["id", "name", "action"];

  allCategories: MatTableDataSource<any>;
  allCategoriesCount: any;
  isLoading: boolean = true;

  pageChangeLoading: boolean = false;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private categoriesService: AllCategoriesService,
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

  ngOnInit() {
    this.categoriesService
      .getAllCategories(10, 1)
      .subscribe((res) => {
        this.allCategories = new MatTableDataSource(res.list);
        this.allCategoriesCount = res.count;
        setTimeout(() => {
          if (this.allCategories != undefined) {
            this.allCategories.sort = this.sort;
          }
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  reloadPage() {
    this.isLoading = true;
    this.categoriesService
      .getAllCategories(this.paginator.pageSize, this.paginator.pageIndex + 1)
      .subscribe((res) => {
        this.allCategories = new MatTableDataSource(res.list);
        this.allCategoriesCount = res.count;
        setTimeout(() => {
          if (this.allCategories != undefined) {
            this.allCategories.sort = this.sort;
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

  addNewCategory() {
    const dialogRef = this.dialog.open(AddCategoryDialog, {
      width: "40rem",
      height: "15rem",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.categoriesService
          .addNewCategory(result.name)
          .subscribe((res) => {
            console.log(res);
          })
          .add(() => {
            this.openSnackBar("New Category added successfully");
            this.reloadPage();
          });
      }
    });
  }

  delete(c) {
    const dialogRef = this.dialog.open(CautionDialog, {
      width: "40rem",
      height: "17rem",
      data: {
        id: c.cat_id,
        title: c.cat_name,
        type: "cat",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.delete == true) {
        this.categoriesService.deleteCategory(c.cat_id).subscribe((res) => {
          this.openSnackBar("Category deleted successfully");
          this.reloadPage();
        });
      }
    });
  }

  pageChange(event) {
    this.pageChangeLoading = true;
    this.categoriesService
      .getAllCategories(event.pageSize, event.pageIndex + 1)
      .subscribe((res) => {
        this.allCategories = new MatTableDataSource(res.list);
      })
      .add(() => {
        this.pageChangeLoading = false;
      });
  }
}
