import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { 
  }

  private errorHandler(error: Error | any): Observable<any> {
    console.log(error);
    return of(null);
  }

  /* section for handling foreign authentication (e.g. using smartphone to scan QR-Code) */
  CheckIfTokenIsValid(token: string): Observable<boolean> {
    return this.http.get<any>(
      `${environment.server}/app-auth-token/checkIfTokenIsValid/${token}`)
      .pipe(
        catchError(this.errorHandler)
    );
  }

  TryAuthenticateForeignApp(foreignAppToken: string, pw: string): Observable<boolean> {
    return this.http.post<any>(
        `${environment.server}/app-auth-token/tryAuthentication/${foreignAppToken}`, { pw: pw })
        .pipe(
          catchError(this.errorHandler)
    );
  }


  /* section for handling own authentication (e.g. web-app running on info-screen) */

  private generateToken(length: number): string {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  GetOwnAppIdToken() {
    let idToken = localStorage.getItem('infowallIdToken');

    if(idToken == null) {
      idToken = this.generateToken(12);
      localStorage.setItem('infowallIdToken', idToken);
    }

    return idToken;
  }

  CheckAuthenticationStatus(): Observable<boolean> {
    return this.http.get<any>(
      `${environment.server}/app-auth-token/checkAuthenticationStatus/${this.GetOwnAppIdToken()}`)
      .pipe(
        catchError(this.errorHandler)
    );
  }
}
