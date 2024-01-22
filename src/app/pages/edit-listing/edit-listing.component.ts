import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { AddImgDialog } from "app/components/add-img-dialog/add-img-dialog.component";
import { AuthService } from "app/services/auth.service";
import { PropertyListingService } from "app/services/property-listings.service";
import { last, map, tap } from "rxjs";

import * as uuid from "uuid";

@Component({
  selector: "app-edit-listing",
  templateUrl: "./edit-listing.component.html",
  styleUrls: ["./edit-listing.component.scss"],
})
export class EditListingComponent implements OnInit {
  uploading_progress: any = 0;
  uploading: boolean = false;
  saving: boolean = false;
  isLoading: boolean = true;

  tinyMceConfig: any;

  main_img: any = "";
  main_img_file: File;

  main_img_changed: boolean = false;

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

  old_gallary_imgs: any[] = [];
  gallary_imgs_new: any[] = [];
  gallary_imgs_deleted: any[] = [];

  floor_imgs_files: File[] = [];
  floor_imgs: any[] = [];

  old_floor_imgs: any[] = [];
  floor_imgs_new: any[] = [];
  floor_imgs_deleted: any[] = [];

  old_main_img: any;

  prop_id: any;

  price_on_app: boolean = false;

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private listingService: PropertyListingService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
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

    this.route.queryParams.subscribe((res) => {
      this.prop_id = res.id;
      this.listingService
        .getListingDetails(res.id)
        .subscribe((data) => {
          console.log(data);

          this.old_main_img = data.image1;
          this.main_img = `https://premium.indusre.com/Admin/pages/forms/uploads/property/${data.image1}`;
          this.address = data.address;
          this.selected_category = data.cat_id;
          this.selected_status = data.status;

          this.frond = data.frond;
          this.completion_status = data.completion_status;
          this.three_D_view_url = data["3d_view"];
          this.unit_type = data.unit_type;
          this.developer = data.developer;
          this.video_url = data.video;
          this.listed_agent = data.listed_agent;
          this.completion_date = data.completion_date;
          this.description = data.description;

          this.price_on_app = data.price_on_app == "1" ? true : false;

          const feat = JSON.parse(data.features.features);
          Object.keys(feat).forEach((key) => {
            this.features.push(feat[key]);
          });

          const gall = JSON.parse(data.gallary.imgs).imgs;
          this.old_gallary_imgs = gall;
          gall.forEach((g) => {
            this.gallary_imgs.push(
              `https://premium.indusre.com/Admin/pages/forms/uploads/galary/${g}`
            );
          });

          if (data.floor_plans != null) {
            const floor_imgs = JSON.parse(data.floor_plans.imgs);
            this.old_floor_imgs = floor_imgs;
            floor_imgs.forEach((f) => {
              this.floor_imgs.push(
                `https://premium.indusre.com/Admin/pages/forms/uploads/floor/${f}`
              );
            });
          }

          if (data.project_data != null) {
            this.property_type = "project";
            this.price = data.project_data.price_range;
            this.area = data.project_data.area_range;
            this.floor = data.project_data.floor_range;
            this.beds = data.project_data.beds_range;
            this.baths = data.project_data.baths_range;
          } else {
            this.property_type = "default";
            this.price = data.price;
            this.area = data.area;
            this.floor = data.floor;
            this.beds = data.beds;
            this.baths = data.baths;
          }
        })
        .add(() => {
          this.isLoading = false;
        });
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
      this.gallary_imgs.forEach((img) => {
        if (
          this.old_gallary_imgs.includes(
            this.old_gallary_imgs.find(
              (ol) => ol == new String(img).split("galary/")[1]
            )
          )
        ) {
          this.gallary_imgs_deleted.push(new String(img).split("galary/")[1]);
        }
      });

      this.gallary_imgs.length = 0;
      this.gallary_imgs_files.length = 0;
    } else {
      this.floor_imgs.forEach((img) => {
        if (
          this.old_floor_imgs.includes(
            this.old_floor_imgs.find(
              (ol) => ol == new String(img).split("floor/")[1]
            )
          )
        ) {
          this.floor_imgs_deleted.push(new String(img).split("floor/")[1]);
        }
      });

      this.floor_imgs.length = 0;
      this.floor_imgs_files.length = 0;
    }
  }

  removeGallaryImg(index: any, type: any) {
    if (type == "gallary") {
      if (
        this.old_gallary_imgs.includes(
          this.old_gallary_imgs.find(
            (ol) =>
              ol == new String(this.gallary_imgs[index]).split("galary/")[1]
          )
        )
      ) {
        this.gallary_imgs_deleted.push(this.old_gallary_imgs[index]);
      } else {
        this.gallary_imgs_files.splice(index, 1);
      }
      this.gallary_imgs.splice(index, 1);
    } else {
      if (
        this.old_floor_imgs.includes(
          this.old_floor_imgs.find(
            (ol) => ol == new String(this.floor_imgs[index]).split("floor/")[1]
          )
        )
      ) {
        this.floor_imgs_deleted.push(this.old_floor_imgs[index]);
      } else {
        this.floor_imgs_files.splice(index, 1);
      }
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
        this.main_img_changed = true;
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
    console.log(this.old_gallary_imgs);
    if (
      this.selected_category != undefined &&
      this.selected_status != undefined &&
      this.address != "" &&
      this.price != "" &&
      this.area != "" &&
      this.features.length != 0 &&
      this.gallary_imgs.length != 0
    ) {
      const random_id = uuid.v4();
      const formdata: FormData = new FormData();
      this.saving = true;
      this.uploading = true;

      let all_gallary_imgs = [];
      this.old_gallary_imgs.forEach((g) => {
        if (!this.gallary_imgs_deleted.includes(g)) {
          all_gallary_imgs.push(g);
        }
      });
      let gallary_imgs = [];
      if (this.gallary_imgs_files.length != 0) {
        gallary_imgs = this.gallary_imgs_files.map(
          (f, i) =>
            `${random_id}_g_${i}.${
              f.name.split(".")[f.name.split(".").length - 1]
            }`
        );

        all_gallary_imgs = [...all_gallary_imgs, ...gallary_imgs];
      }

      let all_floor_imgs = [];
      this.old_floor_imgs.forEach((f) => {
        if (!this.floor_imgs_deleted.includes(f)) {
          all_floor_imgs.push(f);
        }
      });

      let floorplan_imgs = [];
      if (this.floor_imgs.length != 0) {
        floorplan_imgs = this.floor_imgs_files.map(
          (f, i) =>
            `${random_id}_f_${i}.${
              f.name.split(".")[f.name.split(".").length - 1]
            }`
        );
        all_floor_imgs = [...all_floor_imgs, ...floorplan_imgs];
      }

      const data = {
        add_type: this.property_type,
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

        gallary_imgs: all_gallary_imgs,
        floor_plan_imgs: all_floor_imgs,
        features: this.features,
        price_on_app: this.price_on_app,
      };

      this.listingService.updateListing(this.prop_id, data).subscribe((res) => {
        console.log(res);
      });

      if (this.main_img_changed) {
        formdata.append("main_img", this.main_img_file);
        formdata.append("main_img_name", this.old_main_img);
      }

      if (this.gallary_imgs_files.length > 0) {
        formdata.append("g_img_names", JSON.stringify(gallary_imgs));

        this.gallary_imgs_files.forEach((f, i) => {
          formdata.append(`g_img_${i}`, f);
        });
      }

      if (floorplan_imgs.length != 0) {
        formdata.append("f_img_names", JSON.stringify(floorplan_imgs));

        this.floor_imgs_files.forEach((fl, i) => {
          formdata.append(`f_img_${i}`, fl);
        });
      }

      if (this.gallary_imgs_deleted.length > 0) {
        formdata.append(
          "deleted_imgs_g",
          JSON.stringify(this.gallary_imgs_deleted)
        );
      }

      if (this.floor_imgs_deleted.length > 0) {
        formdata.append(
          "deleted_imgs_f",
          JSON.stringify(this.floor_imgs_deleted)
        );
      }

      formdata.append("type", "old");

      this.listingService
        .updateListingImg(formdata)
        .pipe(
          map((event) => this.getEventMessage(event)),
          tap((message) => {
            if (message == "File is 100% uploaded.") {
              this.uploading = false;
              this.openSnackBar("Property updated successfully!");
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
