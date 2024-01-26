import { Component, HostListener, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "app/services/auth.service";

import { HttpEvent, HttpEventType } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ImageOptimizeService } from "app/services/image-optimize.service";
import { last, map, tap } from "rxjs";

@Component({
  selector: "app-bulk-resize",
  templateUrl: "./bulk-resize.component.html",
  styleUrls: ["./bulk-resize.component.scss"],
})
export class BulkResizeComponent implements OnInit {
  img: any;
  imgSelected: boolean = false;

  selected_img_file: File;

  resize_scale: number = 80;

  img_quality: number = 80;
  img_format: any;

  uploading_progress: any = 0;
  uploading: boolean = false;
  image_processing: boolean = false;
  downloading: boolean = false;

  all_images: any[] = [];

  all_images_info: any[] = [];

  all_images_files_raw: any[] = [];

  constructor(
    private imgService: ImageOptimizeService,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    if (!this.authService.currentUserValue) {
      this.router.navigate(["/login"]);
    }
  }

  aspectRatios: any[] = [
    { value: "free-form", viewValue: "Free-form" },
    { value: 4 / 4, viewValue: "Square" },
    { value: 3 / 2, viewValue: "3:2" },
    { value: 4 / 3, viewValue: "4:3" },
    { value: 16 / 9, viewValue: "16:9" },
  ];

  imgFormats: any[] = [
    { value: "png", viewValue: "PNG - Portable Network Graphics" },
    { value: "jpg", viewValue: "JPG - JPEG Image" },
    { value: "webp", viewValue: "WEBP - WebP Image" },
    // { value: "avif", viewValue: "AVIF - AV1 Image File Format" },
    // { value: "tiff", viewValue: "TIFF - Tagged Image File Format" },
  ];

  @HostListener("paste", ["$event"])
  onPaste(e: ClipboardEvent) {
    if (
      e.clipboardData.files.length != 0 &&
      e.clipboardData.files[0].type.startsWith("image")
    ) {
      Array.from(e.clipboardData.files).forEach((file) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          this.all_images.push(event.target.result);

          var img = new Image();
          img.onload = () => {
            this.all_images_files_raw.push({
              file: file,
              width: img.width,
              height: img.height,
            });
          };

          img.src = event.target.result.toString();
        };

        reader.readAsDataURL(file);
      });
    }
  }

  ////////////////////////////////

  onDropFile(event) {
    if (event.addedFiles != undefined) {
      Array.from(event.addedFiles).forEach((file: File) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          this.all_images.push(event.target.result);

          var img = new Image();
          img.onload = () => {
            this.all_images_files_raw.push({
              file: file,
              width: img.width,
              height: img.height,
            });
          };

          img.src = event.target.result.toString();
        };

        reader.readAsDataURL(file);
      });
    }
  }
  ////////////////////////////////

  ngOnInit() {}

  fileChangeEvent(files: File[]): void {
    // console.log(files);
    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        this.all_images.push(event.target.result);

        var img = new Image();
        img.onload = () => {
          this.all_images_files_raw.push({
            file: file,
            width: img.width,
            height: img.height,
          });
        };

        img.src = event.target.result.toString();
      };

      reader.readAsDataURL(file);
    });
  }

  removeImg(index) {
    this.all_images.splice(index, 1);
    this.all_images_files_raw.splice(index, 1);
    this.all_images_info.splice(index, 1);
  }

  ngAfterViewInit() {}

  openSnackBar(message: string) {
    this._snackBar.open(message, "close", {
      duration: 3000,
      // panelClass: "my-custom-snackbar",
      verticalPosition: "bottom",
      horizontalPosition: "center",
    });
  }

  async download() {
    if (this.all_images.length > 0) {
      if (this.img_format != undefined) {
        const options = {
          quality: this.img_quality,
          scale: this.resize_scale,
          format: this.img_format,
        };

        const formData = new FormData();
        formData.append("options", JSON.stringify(options));

        this.all_images_files_raw.forEach((data, index) => {
          formData.append("files[]", data.file);
          formData.append(
            `${index}_img`,
            JSON.stringify({ width: data.width, height: data.height })
          );
        });

        // console.log(this.all_images_files);
        this.uploading = true;
        this.imgService
          .bulkResize(formData)
          .pipe(
            map((event) => this.getEventMessage(event)),
            tap((message) => {
              // console.log(message);
            }),
            last()
          )
          .subscribe((v) => {});
      } else {
        this.openSnackBar("Please select output format!");
      }
    } else {
      this.openSnackBar("Please select images first!");
    }
  }

  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent:
        return "sending";

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = event.total
          ? Math.round((100 * event.loaded) / event.total)
          : 0;

        this.uploading_progress = percentDone;

        if (percentDone == 100) {
          this.uploading = false;
          this.image_processing = true;
        }

        return "upload";

      case HttpEventType.DownloadProgress:
        this.image_processing = false;
        this.downloading = true;
        // Compute and show the % done:
        return "download";

      case HttpEventType.Response:
        this.downloadFile(event.body.data);

        return `File was completely uploaded!`;

      default:
        return `File surprising upload event: ${event.type}.`;
    }
  }

  downloadFile(base64String: string) {
    // Convert the base64 string to a Uint8Array
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the Uint8Array
    const blob = new Blob([byteArray], {
      type: this.getFileType(this.img_format),
    });

    // Create a download link
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `resized_images.zip`;

    // Append the link to the body and trigger the click event
    document.body.appendChild(link);
    link.click();

    // Remove the link from the DOM
    document.body.removeChild(link);
    this.downloading = false;
  }

  private getFileType(type: string): string {
    switch (type) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "webp":
        return "image/webp";
      case "svg":
        return "image/svg+xml";
      case "bmp":
        return "image/bmp";
      case "avif":
        return "image/avif";
      case "tiff":
        return "image/tiff";
      default:
        return "application/octet-stream"; // Default to binary data if extension is unknown
    }
  }

  clear() {
    this.all_images.length = 0;
    this.all_images_files_raw.length = 0;
    this.all_images_info.length = 0;
    this.img_format = null;
  }
}
