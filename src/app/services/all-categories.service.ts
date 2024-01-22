import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

const API_URL = "https://premium.indusre.com/cms/categories";

@Injectable({ providedIn: "root" })
export class AllCategoriesService {
  constructor(public http: HttpClient) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  getAllCategories(limit: number, pageNumber: number) {
    const url = `${API_URL}/get_all_categories.php`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          limit: limit,
          pageNumber: pageNumber,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  addNewCategory(name: any) {
    const url = `${API_URL}/add_new_category.php`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          name: name,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  deleteCategory(id: any) {
    const url = `${API_URL}/delete_category.php`;
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
