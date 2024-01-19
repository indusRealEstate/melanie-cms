import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

const API_URL = "https://premium.indusre.com/cms/property_listings";

@Injectable({ providedIn: "root" })
export class PropertyListingService {
  constructor(public http: HttpClient) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  getAllCategories() {
    const url = `${API_URL}/get_all_categories.php`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllUsers() {
    const url = `${API_URL}/get_all_users.php`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllListings(limit: number, pageNumber: number, search: string) {
    const url = `${API_URL}/get_all_listings.php`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          limit: limit,
          pageNumber: pageNumber,
          search: search,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getListingDetails(id: any) {
    const url = `${API_URL}/get_listing_details.php`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          id: id,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateListing(id: any, data: any) {
    const url = `${API_URL}/update_listing.php`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          id: id,
          data: data,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  addNewListing(data: any) {
    const url = `${API_URL}/add_new_listing.php`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          data: data,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  deleteListing(id: any, img: any) {
    const url = `${API_URL}/delete_listing.php`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          id: id,
          img: img,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateListingImg(data: any) {
    const url = `${API_URL}/update_img.php`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });
    return this.http.request(req);
  }
}
