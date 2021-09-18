import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse
} from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { ToastService } from 'app/services';

import { environment } from 'app/../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
		private toastService: ToastService,
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = localStorage.getItem('access_token');

        if (token && request.url.indexOf(environment.API_URL) >= 0) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token
                }
            });
        }

        return next.handle(request)
            .pipe(
                catchError((err) => {
					if (request.url.indexOf('/auth/login') === -1 && err.status === 401) {
						this.toastService.error('Su sesión ha caducado, porfavor ingrese de nuevo');
						this.router.navigate(['/auth-login']);
					}
                    return throwError(err);
                })
            );
    }
}
