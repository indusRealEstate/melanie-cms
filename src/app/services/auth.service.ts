import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "app/model/user/user.model";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

const API_URL = "https://indusre.com/cms/auth";

@Injectable({ providedIn: "root" })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  // userLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(public http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    const url = `${API_URL}/login.php`;

    return this.http
      .post<any>(url, { username: username, password: password })
      .pipe(
        map((userData) => {
          // login successful if there's a jwt token in the response
          if (userData) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(userData));
            this.currentUserSubject.next(userData);
            sessionStorage.clear();
          }

          if (userData != null) {
            return userData;
          } else {
            return "invalid-user";
          }
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    localStorage.clear();
    sessionStorage.clear();

    setTimeout(() => {
      this.currentUserSubject.next(null);
      location.reload();
      setTimeout(() => {
        this.router.navigate(["/login"]);
      }, 1000);
    }, 500);
  }
}
