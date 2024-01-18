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
import { TeamService } from "app/services/team.service";

@Component({
  selector: "app-team",
  templateUrl: "./team.component.html",
  styleUrls: ["./team.component.scss"],
})
export class TeamComponent implements OnInit {
  displayedColumns: string[] = ["id", "name", "email", "dsgtn", "action"];

  team: MatTableDataSource<any>;
  teamCount: any;
  isLoading: boolean = true;
  pageChangeLoading: boolean = false;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private teamService: TeamService,
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
        img: `https://indusre.com/agentimg/${image}`,
      },
    });
  }

  ngOnInit() {
    this.teamService
      .getTeam(10, 1, "")
      .subscribe((res) => {
        console.log(res);
        this.team = new MatTableDataSource(res.team);
        this.teamCount = res.count;
        setTimeout(() => {
          if (this.team != undefined) {
            this.team.sort = this.sort;
          }
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  reloadPage() {
    this.isLoading = true;
    this.teamService
      .getTeam(10, 1, "")
      .subscribe((res) => {
        this.team = new MatTableDataSource(res.team);
        this.teamCount = res.count;
        setTimeout(() => {
          if (this.team != undefined) {
            this.team.sort = this.sort;
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

  navigateToEditMemberPage(member: any) {
    this.router.navigate(["/edit-team-member"], {
      queryParams: { id: member.client_user_id },
    });
  }
  navigateToAddNewMemberPage() {
    this.router.navigate(["/add-new-team-member"]);
  }

  delete(member) {
    const dialogRef = this.dialog.open(CautionDialog, {
      width: "40rem",
      height: "17rem",
      data: {
        id: member.client_user_id,
        title: member.client_user_name,
        type: "team",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.delete == true) {
        this.teamService
          .deleteMember(member.client_user_id, member.client_user_image)
          .subscribe((res) => {
            this.openSnackBar("Team member deleted successfully");
            this.reloadPage();
          });
      }
    });
  }

  pageChange(event) {
    this.pageChangeLoading = true;
    this.teamService
      .getTeam(event.pageSize, event.pageIndex + 1, "")
      .subscribe((res) => {
        this.team = new MatTableDataSource(res.team);
      })
      .add(() => {
        this.pageChangeLoading = false;
      });
  }
}
