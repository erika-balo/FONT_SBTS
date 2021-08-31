import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'app/../environments/environment';

@Injectable()
export class AuthService {

    private resourceUrl = environment.API_URL + '/auth';

    constructor(
        private http: HttpClient
    ) {
    }

    login(params: any): Observable<any> {
        return this.http.post(this.resourceUrl + '/login', params, { observe: 'response' });
    }

}