import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

const API_URL = "https://indusre.com/cms/popup-ad";

@Injectable({ providedIn: "root" })
export class PopupAdService {
  constructor(public http: HttpClient) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  getPopupAd() {
    const url = `${API_URL}/get_popup_ad.php`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updatePopupAd(id: any, title: any, img :any) {
    const url = `${API_URL}/update_popup_ad.php`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          id: id,
          title: title,
          img: img,
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
