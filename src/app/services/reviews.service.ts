import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

const API_URL = "https://indusre.com/cms/reviews";

@Injectable({ providedIn: "root" })
export class ReviewsService {
  constructor(public http: HttpClient) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  getAllReviews(limit: number, pageNumber: number, search: string) {
    const url = `${API_URL}/get_all_reviews.php`;
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

  getReviewDetails(id: any) {
    const url = `${API_URL}/get_review_details.php`;
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

  updateReview(id: any, data: any) {
    const url = `${API_URL}/update_review.php`;
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
  addNewReview(data: any) {
    const url = `${API_URL}/add_new_review.php`;
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

  deleteReview(id: any) {
    const url = `${API_URL}/delete_review.php`;
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
