import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AddLandingPageSliderDialog } from "app/components/add-landing-page-slider/add-landing-page-slider.component";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog.component";
import { ImgViewDialog } from "app/components/img-view-dialog/img-view-dialog.component";
import { AuthService } from "app/services/auth.service";
import { ProjectsService } from "app/services/projects.service";

@Component({
  selector: "app-projectsr",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
})
export class ProjectsComponent implements OnInit {
  isLoading: boolean = true;

  dataSource = [];

  not_saved_order: boolean = false;

  uploading_progress: any = 0;
  uploading: boolean = false;
  constructor(
    private projectsServices: ProjectsService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.currentUserValue) {
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit() {
    this.projectsServices
      .getallImages()
      .subscribe((data) => {
        this.dataSource = data;
        // console.log(data);
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  enlargeImage(image) {
    const dialogRef = this.dialog.open(ImgViewDialog, {
      width: "70rem",
      height: "35rem",
      data: {
        img: `https://premium.indusre.com/Admin/pages/forms/uploads/property/${image}`,
      },
    });
  }

  revertOrder() {
    this.isLoading = true;
    this.projectsServices
      .getallImages()
      .subscribe((data) => {
        this.dataSource = data;
      })
      .add(() => {
        this.isLoading = false;
        this.not_saved_order = false;
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    this.not_saved_order = true;
    moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);

    let i = 1;
    this.dataSource.forEach((e) => {
      e.sort_order = i;
      i++;
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

  updateSortOrder() {
    if (this.not_saved_order == true) {
      const new_order = this.dataSource.map((item) => item.prop_id);
      this.projectsServices
        .updateSortOrder(new_order)
        .subscribe((res) => {})
        .add(() => {
          this.openSnackBar("Slider order updated successfully");
          this.revertOrder();
        });
    }
  }

  delete(slider) {
    const dialogRef = this.dialog.open(CautionDialog, {
      width: "40rem",
      height: "17rem",
      data: {
        id: slider.prop_id,
        title: slider.address,
        type: "prj",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.delete == true) {
        this.projectsServices
          .removeSlider(slider.prop_id)
          .subscribe((res) => {
            // console.log(res);
          })
          .add(() => {
            this.openSnackBar("Slider removed successfully");
            this.revertOrder();
          });
      }
    });
  }

  addNewSlider() {
    const dialogRef = this.dialog.open(AddLandingPageSliderDialog, {
      width: "80%",
      height: "50rem",
      data: "project",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.projectsServices
          .addToSliders(result.ids)
          .subscribe((res) => {})
          .add(() => {
            this.openSnackBar("New slider added successfully");
            this.revertOrder();
          });
      }
    });
  }
}
