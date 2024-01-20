import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { LandingPageSliderService } from "app/services/landing-page-slider.service";
import { PropertyListingService } from "app/services/property-listings.service";

@Component({
  selector: "add-landing-page-slider",
  styleUrls: ["./add-landing-page-slider.component.scss"],
  templateUrl: "./add-landing-page-slider.component.html",
})
export class AddLandingPageSliderDialog implements OnInit {
  selected_ids: any[] = [];
  displayedColumns: string[] = [
    "id",
    "address",
    "price",
    "status",
    "category",
    "action",
  ];

  allListings: MatTableDataSource<any>;
  allListingsCount: any;
  isLoading: boolean = true;

  pageChangeLoading: boolean = false;

  existing_sliders_ids: any[] = [];

  search_text: string = "";

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddLandingPageSliderDialog>,
    public listingService: PropertyListingService,
    private landingSliderServices: LandingPageSliderService,
    private dialog?: MatDialog
  ) {
    this.landingSliderServices.getallImages().subscribe((data: any[]) => {
      this.existing_sliders_ids = data.map((item) => item.prop_id);
    });
  }

  ngOnInit() {
    this.listingService
      .getAllListings(6, 1, "")
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

  checkExisting(id) {
    if (this.existing_sliders_ids.includes(id)) {
      return true;
    } else {
      return false;
    }
  }
  checkAdded(id) {
    if (this.selected_ids.includes(id)) {
      return true;
    } else {
      return false;
    }
  }

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
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

  addToList(id, index) {
    if (this.checkAdded(id)) {
      var i = this.selected_ids.findIndex((item) => item == id);
      this.selected_ids.splice(i, 1);
    } else {
      this.selected_ids.push(id);
    }
  }

  pageChange(event) {
    this.pageChangeLoading = true;
    this.listingService
      .getAllListings(event.pageSize, event.pageIndex + 1, this.search_text)
      .subscribe((res) => {
        this.allListings = new MatTableDataSource(res.list);
      })
      .add(() => {
        this.pageChangeLoading = false;
      });
  }

  submit() {
    this.selected_ids = [...this.existing_sliders_ids, ...this.selected_ids];
    // console.log(this.selected_ids);
    this.landingSliderServices
      .addToSliders(this.selected_ids)
      .subscribe((res) => {})
      .add(() => {
        this.dialogRef.close("added");
      });
  }
}
