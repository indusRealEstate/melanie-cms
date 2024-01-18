import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

const API_URL = "https://indusre.com/cms/ad-banner";

@Injectable({ providedIn: "root" })
export class AdBannerService {
  constructor(public http: HttpClient) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  getallImages() {
    const url = `${API_URL}/get_all_banners.php`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateSortOrder(data: any) {
    const url = `${API_URL}/update_sort_order.php`;
    return this.http.post<any>(url, JSON.stringify({ data: data })).pipe(
      map((data) => {
        return data;
      })
    );
  }

  addNewBanner(data: any) {
    const url = `${API_URL}/add_new_banner.php`;
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

  deleteBanner(id: any, img: any) {
    const url = `${API_URL}/delete_banner.php`;
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

  updateBanner(id: any, title: any, subtitle : any) {
    const url = `${API_URL}/update_banner.php`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          id: id,
          title: title,
          subtitle: subtitle,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateImg(data: any) {
    const url = `${API_URL}/update_img.php`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });
    return this.http.request(req);
  }
}
