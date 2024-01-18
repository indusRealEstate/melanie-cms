import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

const API_URL = "https://indusre.com/cms/news";

@Injectable({ providedIn: "root" })
export class NewsService {
  constructor(public http: HttpClient) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  getallNews(limit: number, pageNumber: number, search: string) {
    const url = `${API_URL}/get_all_news.php`;
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

  getNewsDetails(id: any) {
    const url = `${API_URL}/get_news_details.php`;
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

  updateNews(id: any, data: any) {
    const url = `${API_URL}/update_news.php`;
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
  addNewNews(data: any) {
    const url = `${API_URL}/add_new_news.php`;
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

  deleteNews(id: any, mainImg: any, thumbnail: any) {
    const url = `${API_URL}/delete_news.php`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          id: id,
          mainImg: mainImg,
          thumbnail: thumbnail,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateNewsImg(data: any) {
    const url = `${API_URL}/update_img.php`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });
    return this.http.request(req);
  }
}
