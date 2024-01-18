import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

const API_URL = "https://indusre.com/cms/dashboard";

@Injectable({ providedIn: "root" })
export class DashboardService {
  constructor(public http: HttpClient) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  getallStats() {
    const url = `${API_URL}/get_all_stats.php`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
