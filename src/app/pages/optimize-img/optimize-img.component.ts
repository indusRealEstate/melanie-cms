import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "app/services/auth.service";
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from "ngx-image-cropper";

import { MatSnackBar } from "@angular/material/snack-bar";
import { ImageOptimizeService } from "app/services/image-optimize.service";
import { Observable, bindCallback, last, map, of, tap } from "rxjs";
import { HttpEvent, HttpEventType } from "@angular/common/http";

@Component({
  selector: "app-optimize-img",
  templateUrl: "./optimize-img.component.html",
  styleUrls: ["./optimize-img.component.scss"],
})
export class OptimizeImgComponent implements OnInit {
  img: any;
  imgSelected: boolean = false;

  selected_img_file: File;

  maintainAspectRatio: boolean = false;

  lockAspectRatio: boolean = true;

  aspectRatio: any;

  imageChangedEvent: any = "";
  croppedImage: any = "";
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  resize_width: number = 0;
  resize_height: number = 0;
  resize_scale: number = 100;

  img_quality: number = 80;
  img_format: any;

  img_file_name: any = "";

  // fileSize: any = "200 KB";

  img_og_width: number;
  img_og_height: number;

  cropper: any = {};

  cropper_ready: boolean = false;

  uploading_progress: any = 0;
  uploading: boolean = false;
  image_processing: boolean = false;
  downloading: boolean = false;
  upscaling: boolean = false;

  current_cropped_width: number = 0;
  current_cropped_height: number = 0;

  tensorflow_upscale: boolean = false;

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
    { value: "avif", viewValue: "AVIF - AV1 Image File Format" },
    { value: "tiff", viewValue: "TIFF - Tagged Image File Format" },
  ];

  aspectRatioChange(event: any) {
    if (event.value == "free-form") {
      this.maintainAspectRatio = false;
    } else {
      this.maintainAspectRatio = true;
      this.aspectRatio = event.value;
    }
  }

  @HostListener("paste", ["$event"])
  onPaste(e: ClipboardEvent) {
    if (
      e.clipboardData.files.length != 0 &&
      e.clipboardData.files[0].type.startsWith("image")
    ) {
      this.selected_img_file = e.clipboardData.files[0];
      this.img_file_name = e.clipboardData.files[0].name.split(".")[0];
      this.imgSelected = true;
    }
  }

  ////////////////////////////////

  onDropFile(event) {
    if (event.addedFiles != undefined) {
      this.selected_img_file = event.addedFiles[0];
      this.img_file_name = event.addedFiles[0].name.split(".")[0];
      this.imgSelected = true;
    }
  }
  ////////////////////////////////

  ngOnInit() {}

  ngAfterViewInit() {}

  resizeImage() {
    this.resize_width = Math.round(
      this.current_cropped_width * (this.resize_scale / 100)
    );
    this.resize_height = Math.round(
      Math.min(
        (this.resize_width * this.current_cropped_height) /
          this.current_cropped_width
      )
    );
  }

  clickResizeDimention(type) {
    if (this.lockAspectRatio) {
      if (type == "w") {
        this.resize_height = Math.round(
          Math.min(
            (this.resize_width * this.current_cropped_height) /
              this.current_cropped_width
          )
        );

        var perc = (100 * this.resize_width) / this.current_cropped_width;
        this.resize_scale = Number(perc.toFixed(2));
      } else if (type == "h") {
        this.resize_width = Math.round(
          Math.min(
            (this.resize_height * this.current_cropped_width) /
              this.current_cropped_height
          )
        );

        var perc = (100 * this.resize_width) / this.current_cropped_width;
        this.resize_scale = Number(perc.toFixed(2));
      }
    } else {
    }
  }

  cropByCordinates() {
    this.transform = { ...this.transform };
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "close", {
      duration: 3000,
      // panelClass: "my-custom-snackbar",
      verticalPosition: "bottom",
      horizontalPosition: "center",
    });
  }

  async download() {
    if (this.imgSelected) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result.toString().split(",")[1]; // Base64-encoded image data

        if (this.tensorflow_upscale) {
          this.cropper_ready = false;
          this.uploading = true;
          this.img_format = "png";
          this.imgService
            .upscaleImage(imageData)
            .pipe(
              map((event) => this.getEventMessage(event)),
              tap((message) => {
                // console.log(message);
              }),
              last()
            )
            .subscribe((v) => {});
        } else {
          if (this.img_format != undefined) {
            const options = {
              width: this.resize_width,
              height: this.resize_height,
              quality: this.img_quality,
              format: this.img_format,
            };

            this.cropper_ready = false;
            this.uploading = true;
            this.imgService
              .optimizeImage(imageData, options)
              .pipe(
                map((event) => this.getEventMessage(event)),
                tap((message) => {
                  // console.log(message);
                }),
                last()
              )
              .subscribe((v) => {});
          } else {
            this.openSnackBar("Please select image format!");
          }
        }
      };

      reader.readAsDataURL(
        new Blob([this.croppedImage], { type: "image/png" })
      );
    } else {
      this.openSnackBar("Please upload image!");
    }
  }

  upscaleImg(files) {}

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

          if (!this.tensorflow_upscale) {
            this.image_processing = true;
          } else {
            this.upscaling = true;
          }
        }
        return "upload";

      case HttpEventType.DownloadProgress:
        this.downloading = true;

        if (!this.tensorflow_upscale) {
          this.image_processing = false;
        } else {
          this.upscaling = false;
        }
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
    link.download = `${this.img_file_name}.${this.img_format}`;

    // Append the link to the body and trigger the click event
    document.body.appendChild(link);
    link.click();

    // Remove the link from the DOM
    document.body.removeChild(link);
    this.cropper_ready = true;
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

  fileChangeEvent(event: any): void {
    console.log(event.target.files);
    if (event.target.files.length > 0) {
      this.cropper_ready = false;
      this.imgSelected = true;
      this.resize_scale = 100;

      this.img_file_name = event.target.files[0].name.split(".")[0];

      this.selected_img_file = event.target.files[0];
    }
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
    this.resize_width = event.imagePosition.x2 - event.imagePosition.x1;
    this.resize_height = event.imagePosition.y2 - event.imagePosition.y1;

    this.current_cropped_width =
      event.imagePosition.x2 - event.imagePosition.x1;
    this.current_cropped_height =
      event.imagePosition.y2 - event.imagePosition.y1;

    this.resize_scale = 100;
  }
  imageLoaded(event) {
    this.showCropper = true;
    this.img_og_width = event.transformed.size.width;
    this.img_og_height = event.transformed.size.height;
  }
  cropperReady(sourceImageDimensions: Dimensions) {
    // cropper ready
    console.log("Cropper ready", sourceImageDimensions);
    this.cropper_ready = true;
  }
  loadImageFailed() {
    // show message
    console.log("Load failed");
  }

  clear() {
    this.tensorflow_upscale = false;
    this.cropper_ready = false;
    this.imgSelected = false;
    this.img_file_name = "";
    this.selected_img_file = null;
    this.imageChangedEvent = "";
    this.resize_height = 0;
    this.resize_width = 0;
    this.img_og_width = 0;
    this.img_og_height = 0;
    this.img_format = null;

    this.current_cropped_width = 0;
    this.current_cropped_height = 0;
    this.cropper = {};

    this.maintainAspectRatio = false;
    this.aspectRatio = "free-form";
    this.resize_scale = 100;
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
  }

  rotateLeft() {
    this.cropper_ready = false;
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.cropper_ready = false;
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  resetImage() {
    this.tensorflow_upscale = false;
    this.maintainAspectRatio = false;
    this.aspectRatio = "free-form";
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
    this.resize_scale = 100;
    this.cropper.x1 = 0;
    this.cropper.xy = 0;
    this.cropper.x2 = this.img_og_width;
    this.cropper.y2 = this.img_og_height;
    this.transform = { ...this.transform };
  }

  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }
}
