import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { InFocusService } from "app/services/in-focus.service";
import { PropertyListingService } from "app/services/property-listings.service";

@Component({
  selector: "select-infocus-dialog",
  styleUrls: ["./select-infocus-dialog.component.scss"],
  templateUrl: "./select-infocus-dialog.component.html",
})
export class SelectInFocusDialog implements OnInit {
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

  search_text: string = "";

  current_infocus_id: any;

  selected_id: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SelectInFocusDialog>,
    public listingService: PropertyListingService,
    private infocusServices: InFocusService
  ) {
    this.infocusServices.getInFocusDetails().subscribe((res) => {
      this.current_infocus_id = res.prop_id;
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
    if (this.current_infocus_id == id) {
      return true;
    } else {
      return false;
    }
  }
  checkAdded(id) {
    if (this.selected_id == id) {
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
    } else {
      this.pageChangeLoading = true;
      this.listingService
        .getAllListings(this.paginator.pageSize, 1, "")
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

  addToList(id) {
    if (this.checkAdded(id)) {
      this.selected_id = undefined;
    } else {
      this.selected_id = id;
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
    this.dialogRef.close({
      id: this.selected_id,
      data: this.allListings.data.find((l) => l.prop_id == this.selected_id),
    });
  }
}
