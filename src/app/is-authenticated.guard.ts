import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { AuthService } from './shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.CheckAuthenticationStatus().pipe(
          switchMap(authenticated => {
            if (authenticated) {
              return this.authService.FetchApiToken().pipe(
                map(() => true) // erst nach erfolgreichem Token-Fetch darf aktiviert werden
              );
            } else {
              return of(
                this.router.createUrlTree(
                  ['/auth'],
                  { queryParams: { returnUrl: state.url } }
                )
              );
            }
          })
        );
  }
}
