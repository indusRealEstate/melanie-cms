import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

const API_URL = "https://premium.indusre.com/cms/display-two-beds";

@Injectable({ providedIn: "root" })
export class DisplayTwoBedsService {
  constructor(public http: HttpClient) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  getallImages() {
    const url = `${API_URL}/get_all_sliders.php`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateSortOrder(data: any) {
    const url = `${API_URL}/re_order_slider.php`;
    return this.http.post<any>(url, JSON.stringify({ data: data })).pipe(
      map((data) => {
        return data;
      })
    );
  }

  addToSliders(data: any) {
    const url = `${API_URL}/add_to_slider.php`;
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

  removeSlider(id: any) {
    const url = `${API_URL}/remove_slider.php`;
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
}
