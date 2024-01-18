import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

const API_URL = "https://indusre.com/cms/developers";

@Injectable({ providedIn: "root" })
export class DevelopersService {
  constructor(public http: HttpClient) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  getAllDevelopers(limit: number, pageNumber: number, search: string) {
    const url = `${API_URL}/get_all_developer.php`;
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

  getDeveloperDetails(id: any) {
    const url = `${API_URL}/get_developer_details.php`;
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

  updateDeveloper(id: any, data: any) {
    const url = `${API_URL}/update_developer.php`;
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
  addNewDeveloper(data: any) {
    const url = `${API_URL}/add_new_developer.php`;
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

  deleteDeveloper(id: any, logo: any, main_img: any, about_img: any) {
    const url = `${API_URL}/delete_developer.php`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          id: id,
          logo: logo,
          main_img: main_img,
          about_img: about_img,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateDeveloperImg(data: any) {
    const url = `${API_URL}/update_img.php`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });
    return this.http.request(req);
  }
}
