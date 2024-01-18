import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Route, Router } from "@angular/router";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog.component";
import { AuthService } from "app/services/auth.service";
import { BlogsService } from "app/services/blog.service";

@Component({
  selector: "app-blogs",
  templateUrl: "./blogs.component.html",
  styleUrls: ["./blogs.component.scss"],
})
export class BlogsComponent implements OnInit {
  displayedColumns: string[] = ["id", "title", "date", "action"];

  allBlogs: MatTableDataSource<any>;
  allBlogsCount: any;
  isLoading: boolean = true;
  pageChangeLoading: boolean = false;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private blogsService: BlogsService,
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
    this.blogsService
      .getallBlogs(10, 1, "")
      .subscribe((res) => {
        this.allBlogs = new MatTableDataSource(res.blogs);
        this.allBlogsCount = res.count;
        setTimeout(() => {
          if (this.allBlogs != undefined) {
            this.allBlogs.sort = this.sort;
          }
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  reloadPage() {
    this.isLoading = true;
    this.blogsService
      .getallBlogs(10, 1, "")
      .subscribe((res) => {
        this.allBlogs = new MatTableDataSource(res.blogs);
        this.allBlogsCount = res.count;
        setTimeout(() => {
          if (this.allBlogs != undefined) {
            this.allBlogs.sort = this.sort;
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

  navigateToViewPage(blog: any) {
    this.router.navigate(["/blog-view"], {
      queryParams: { id: blog.blogs_id },
    });
  }
  navigateToAddNewBlogPage() {
    this.router.navigate(["/add-new-blog"]);
  }

  delete(blog) {
    const dialogRef = this.dialog.open(CautionDialog, {
      width: "40rem",
      height: "17rem",
      data: {
        id: blog.blogs_id,
        title: blog.blogs_title,
        type: "blog",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.delete == true) {
        this.blogsService
          .deleteBlog(blog.blogs_id, blog.blogs_mainimage, blog.blogs_thumbnail)
          .subscribe((res) => {
            this.openSnackBar("Blog deleted successfully");
            this.reloadPage();
          });
      }
    });
  }

  pageChange(event) {
    this.pageChangeLoading = true;
    this.blogsService
      .getallBlogs(event.pageSize, event.pageIndex + 1, "")
      .subscribe((res) => {
        this.allBlogs = new MatTableDataSource(res.blogs);
      })
      .add(() => {
        this.pageChangeLoading = false;
      });
  }
}
