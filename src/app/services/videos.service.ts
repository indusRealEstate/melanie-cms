import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

const API_URL = "https://indusre.com/cms/videos";

@Injectable({ providedIn: "root" })
export class VideoService {
  constructor(public http: HttpClient) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  getAllVideos(limit: number, pageNumber: number, search: string) {
    const url = `${API_URL}/get_all_videos.php`;
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

  getVideoDetails(id: any) {
    const url = `${API_URL}/get_video_details.php`;
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

  updateVideo(id: any, data: any) {
    const url = `${API_URL}/update_video.php`;
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
  addNewVideo(data: any) {
    const url = `${API_URL}/add_new_video.php`;
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

  deleteVideo(id: any, img: any) {
    const url = `${API_URL}/delete_video.php`;
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

  updateVideoImg(data: any) {
    const url = `${API_URL}/update_img.php`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });
    return this.http.request(req);
  }
}
