import {
  HttpClient,
  HttpErrorResponse,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ImageOptimizeService {
  private apiUrl = "https://ireproperty.com";

  constructor(private http: HttpClient) {}

  optimizeImage(imageData: any, options: any): Observable<any> {
    const url = `${this.apiUrl}/optimize-image`;
    const req = new HttpRequest(
      "POST",
      url,
      {
        imageData,
        options,
      },
      {
        reportProgress: true,
        responseType: "json",
      }
    );

    return this.http.request(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle the error here
        console.error("API request failed:", error);

        // Rethrow the error or return a custom error object
        return throwError(
          "An error occurred during the API request. Please try again."
        );
      })
    );
  }

  upscaleImage(imageData: any) {
    const url = `http://127.0.0.1:5000/img`;

    const req = new HttpRequest(
      "POST",
      url,
      {
        img: imageData,
      },
      {
        reportProgress: true,
        responseType: "json",
      }
    );

    return this.http.request(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle the error here
        console.error("API request failed:", error);

        // Rethrow the error or return a custom error object
        return throwError(
          "An error occurred during the API request. Please try again."
        );
      })
    );
  }
}
