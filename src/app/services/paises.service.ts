import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'app/../environments/environment';

@Injectable()
export class PaisesService {

    private resourceUrl = environment.API_URL + '/paises';

    constructor(
        private http: HttpClient
    ) {
    }

    findAll(): Observable<any> {
        return this.http.get(this.resourceUrl, { observe: 'response' });
    }

}