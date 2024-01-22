import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AddImgDialog } from "app/components/add-img-dialog/add-img-dialog.component";
import { AuthService } from "app/services/auth.service";
import { PropertyListingService } from "app/services/property-listings.service";
import { last, map, tap } from "rxjs";

import * as uuid from "uuid";

@Component({
  selector: "app-add-new-listing",
  templateUrl: "./add-new-listing.component.html",
  styleUrls: ["./add-new-listing.component.scss"],
})
export class AddNewListingComponent implements OnInit {
  uploading_progress: any = 0;
  uploading: boolean = false;
  saving: boolean = false;

  tinyMceConfig: any;

  price_on_app: boolean = false;

  main_img: any = "assets/img/add-image.png";
  main_img_file: File;

  property_type: any = "default";

  selected_category: any;
  categories: any[] = [];
  selected_status: any;
  address: any;
  price: any;
  area: any;
  floor: any;
  beds: any;
  baths: any;
  frond: any;
  completion_status: any;
  feature_description: any;

  typing_feature: any;
  features: any[] = [];

  floor_name: any;
  unit_type: any;
  three_D_view_url: any;
  video_url: any;
  description: any;
  developer: any;
  completion_date: any;

  listed_agent: any;
  all_agents: any[] = [];

  gallary_imgs_files: File[] = [];
  gallary_imgs: any[] = [];

  floor_imgs_files: File[] = [];
  floor_imgs: any[] = [];

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private listingService: PropertyListingService,
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.currentUserValue) {
      this.router.navigate(["/login"]);
    }

    this.listingService.getAllCategories().subscribe((data) => {
      this.categories = data;
    });

    this.listingService.getAllUsers().subscribe((data) => {
      this.all_agents = data;
    });

    this.tinyMceConfig = {
      height: 500,
      // menubar: true,
      plugins: [
        "advlist",
        "autolink",
        "link",
        "image",
        "lists",
        "charmap",
        "preview",
        "anchor",
        "pagebreak",
        "searchreplace",
        "wordcount",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "emoticons",
        "template",
        "help",
      ],
      toolbar:
        "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | " +
        "bullist numlist outdent indent | link image | print preview media fullscreen | " +
        "forecolor backcolor emoticons | help",
      // plugins: [
      //   "advlist autolink lists link image charmap print preview anchor",
      //   "searchreplace visualblocks code fullscreen",
      //   "insertdatetime media table paste code help wordcount",
      //   "tinycomments mentions codesample emoticons checklist mediaembed",
      //   "casechange export formatpainter pageembed permanentpen footnotes",
      //   "advtemplate advtable advcode editimage tableofcontents mergetags",
      //   "powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss textcolor",
      // ],
      // toolbar: `undo redo | blocks fontfamily fontsize | formatselect | bold italic backcolor forecolor underline strikethrough link |
      //           align checklist numlist bullist indent outdent | emoticons charmap |
      //           image media table mergetags | lineheight | tinycomments |
      //           removeformat`,
      menubar: "file edit view insert format tools table help",
      link_default_target: "_blank",
    };
  }

  ngOnInit() {}

  addNewFeature(feature) {
    this.features.push(feature);
    this.typing_feature = "";
  }

  removeFeature(index) {
    this.features.splice(index, 1);
  }

  handleFileInputGallary(files: FileList, type: any) {
    if (type == "gallary") {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        this.gallary_imgs_files.push(file);
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          this.gallary_imgs.push(event.target.result);
        };
      });
    } else {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        this.floor_imgs_files.push(file);
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          this.floor_imgs.push(event.target.result);
        };
      });
    }
  }

  removeAllGallaryimgs(type: any) {
    if (type == "gallary") {
      this.gallary_imgs.length = 0;
      this.gallary_imgs_files.length = 0;
    } else {
      this.floor_imgs.length = 0;
      this.floor_imgs_files.length = 0;
    }
  }

  removeGallaryImg(index: any, type: any) {
    if (type == "gallary") {
      this.gallary_imgs_files.splice(index, 1);
      this.gallary_imgs.splice(index, 1);
    } else {
      this.floor_imgs_files.splice(index, 1);
      this.floor_imgs.splice(index, 1);
    }
  }

  editImg(img, type): void {
    const dialogRef = this.dialog.open(AddImgDialog, {
      width: "40rem",
      height: "34rem",
      data: img,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.main_img = result.img;
        this.main_img_file = result.file;
      }
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

  save() {
    if (
      this.main_img != "assets/img/add-image.png" &&
      this.selected_category != undefined &&
      this.selected_status != undefined &&
      this.address != undefined &&
      this.price != undefined &&
      this.area != undefined &&
      this.features.length != 0 &&
      this.gallary_imgs.length != 0
    ) {
      const random_id = uuid.v4();
      const formdata: FormData = new FormData();
      this.saving = true;
      this.uploading = true;

      const gallary_imgs = this.gallary_imgs_files.map(
        (f, i) =>
          `${random_id}_g_${i}.${
            f.name.split(".")[f.name.split(".").length - 1]
          }`
      );

      let floorplan_imgs = [];
      if (this.floor_imgs.length != 0) {
        floorplan_imgs = this.floor_imgs_files.map(
          (f, i) =>
            `${random_id}_f_${i}.${
              f.name.split(".")[f.name.split(".").length - 1]
            }`
        );
      }

      const data = {
        add_type: this.property_type,
        main_img: `${random_id}_main.${
          this.main_img_file.name.split(".")[
            this.main_img_file.name.split(".").length - 1
          ]
        }`,
        address: this.address,
        price: this.price,
        status: this.selected_status,
        cat_id: this.selected_category,
        area: this.area,
        floor: this.floor,
        beds: this.beds,
        baths: this.baths,
        listed_agent: this.listed_agent,
        three_d_view: this.three_D_view_url,
        video: this.video_url,
        frond: this.frond,
        completion_status: this.completion_status,
        description: this.description,
        developer: this.developer,
        completion_date: this.completion_date,
        unit_type: this.unit_type,

        gallary_imgs: gallary_imgs,
        floor_plan_imgs: floorplan_imgs,
        features: this.features,
        price_on_app: this.price_on_app,
      };

      this.listingService.addNewListing(data).subscribe((res) => {
        console.log(res);
      });

      formdata.append("main_img", this.main_img_file);
      formdata.append("main_img_name", `${random_id}_main`);

      formdata.append("g_img_names", JSON.stringify(gallary_imgs));

      this.gallary_imgs_files.forEach((f, i) => {
        formdata.append(`g_img_${i}`, f);
      });

      if (floorplan_imgs.length != 0) {
        formdata.append("f_img_names", JSON.stringify(floorplan_imgs));

        this.floor_imgs_files.forEach((fl, i) => {
          formdata.append(`f_img_${i}`, fl);
        });
      }

      formdata.append("type", "new");

      this.listingService
        .updateListingImg(formdata)
        .pipe(
          map((event) => this.getEventMessage(event)),
          tap((message) => {
            if (message == "File is 100% uploaded.") {
              this.uploading = false;
              this.openSnackBar("New Property successfully added!");
              setTimeout(() => {
                this.router.navigate(["/property-listings"]);
              }, 500);
            }
          }),
          last()
        )
        .subscribe((v) => {});
    }
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
