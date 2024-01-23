import { LiveAnnouncer } from "@angular/cdk/a11y";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AddAgentDialog } from "app/components/add-agent-dialog/add-agent-dialog.component";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog.component";
import { EditAgentDialog } from "app/components/edit-agent-dialog/edit-agent-dialog.component";
import { ImgViewDialog } from "app/components/img-view-dialog/img-view-dialog.component";
import { AgentsService } from "app/services/agents.service";
import { AuthService } from "app/services/auth.service";
import { last, map, tap } from "rxjs";
import * as uuid from "uuid";

@Component({
  selector: "app-all-agents",
  templateUrl: "./all-agents.component.html",
  styleUrls: ["./all-agents.component.scss"],
})
export class AllAgentsComponent implements OnInit {
  displayedColumns: string[] = [
    "id",
    "name",
    "email",
    "role",
    "username",
    "password",
    "action",
  ];

  allAgents: MatTableDataSource<any>;
  allAgentsCount: any;
  isLoading: boolean = true;

  pageChangeLoading: boolean = false;

  uploading_progress: any = 0;
  uploading: boolean = false;
  search_text: string = "";

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private agentService: AgentsService,
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
        img: `https://premium.indusre.com/Admin/pages/forms/uploads/agents/${image}`,
      },
    });
  }

  ngOnInit() {
    this.agentService
      .getAllAgents(10, 1, "")
      .subscribe((res) => {
        this.allAgents = new MatTableDataSource(res.list);
        this.allAgentsCount = res.count;
        setTimeout(() => {
          if (this.allAgents != undefined) {
            this.allAgents.sort = this.sort;
          }
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  reloadPage() {
    this.search_text = "";
    this.isLoading = true;
    this.agentService
      .getAllAgents(this.paginator.pageSize, this.paginator.pageIndex + 1, "")
      .subscribe((res) => {
        this.allAgents = new MatTableDataSource(res.list);
        this.allAgentsCount = res.count;
        setTimeout(() => {
          if (this.allAgents != undefined) {
            this.allAgents.sort = this.sort;
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
      this.agentService
        .getAllAgents(this.paginator.pageSize, 1, this.search_text)
        .subscribe((res) => {
          this.allAgents = new MatTableDataSource(res.list);
          this.allAgentsCount = res.count;
          setTimeout(() => {
            if (this.allAgents != undefined) {
              this.allAgents.sort = this.sort;
            }
          });
        })
        .add(() => {
          this.pageChangeLoading = false;
        });
    } else {
      this.pageChangeLoading = true;
      this.agentService
        .getAllAgents(this.paginator.pageSize, 1, "")
        .subscribe((res) => {
          this.allAgents = new MatTableDataSource(res.list);
          this.allAgentsCount = res.count;
          setTimeout(() => {
            if (this.allAgents != undefined) {
              this.allAgents.sort = this.sort;
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

  editListing(ag: any) {
    const dialogRef = this.dialog.open(EditAgentDialog, {
      width: "40rem",
      height: "55rem",
      data: {
        image: `https://premium.indusre.com/Admin/pages/forms/uploads/agents/${ag.image_name}`,
        name: ag.name,
        role: ag.role,
        username: ag.username,
        password: ag.password,
        email: ag.email,
        phone_no: ag.phone_no,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.agentService
          .updateAgent(ag.id, result)
          .subscribe((res) => {
            console.log(res);
          })
          .add(() => {
            if (!result.img_changed) {
              this.openSnackBar("Agent updated successfully!");
              this.reloadPage();
            }
          });

        if (result.img_changed) {
          this.uploading = true;
          const formdata: FormData = new FormData();
          formdata.append("main_img", result.image_file);
          formdata.append("main_img_name", ag.image_name);
          formdata.append("type", "old");

          this.agentService
            .updateAgentImg(formdata)
            .pipe(
              map((event) => this.getEventMessage(event)),
              tap((message) => {
                if (message == "File is 100% uploaded.") {
                  this.uploading = false;
                  this.openSnackBar("New Agent added successfully!");
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
  addNewAgent() {
    const dialogRef = this.dialog.open(AddAgentDialog, {
      width: "40rem",
      height: "55rem",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        const random_id = uuid.v4();
        result["uuid"] = random_id;
        result["img"] = `${random_id}_avatar.${
          result.image_file.name.split(".")[
            result.image_file.name.split(".").length - 1
          ]
        }`;
        this.agentService.addNewAgent(result).subscribe((res) => {
          console.log(res);
        });

        this.uploading = true;

        const formdata: FormData = new FormData();

        formdata.append("main_img", result.image_file);
        formdata.append("main_img_name", `${random_id}_avatar`);
        formdata.append("type", "new");

        console.log(result);

        this.agentService
          .updateAgentImg(formdata)
          .pipe(
            map((event) => this.getEventMessage(event)),
            tap((message) => {
              if (message == "File is 100% uploaded.") {
                this.uploading = false;
                this.openSnackBar("New Agent added successfully!");
                this.reloadPage();
              }
            }),
            last()
          )
          .subscribe((v) => {});
      }
    });
  }

  delete(ag) {
    const dialogRef = this.dialog.open(CautionDialog, {
      width: "40rem",
      height: "17rem",
      data: {
        id: ag.id,
        title: ag.name,
        type: "ag",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.delete == true) {
        this.agentService.deleteAgent(ag.id, ag.image_name).subscribe((res) => {
          this.openSnackBar("Agent deleted successfully");
          this.reloadPage();
        });
      }
    });
  }

  pageChange(event) {
    this.pageChangeLoading = true;
    this.agentService
      .getAllAgents(event.pageSize, event.pageIndex + 1, "")
      .subscribe((res) => {
        this.allAgents = new MatTableDataSource(res.list);
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
