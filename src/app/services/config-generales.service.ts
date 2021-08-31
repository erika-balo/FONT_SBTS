import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'app/../environments/environment';

@Injectable()
export class ConfigGeneralesService {

    private resourceUrl = environment.API_URL + '/config-generales';

    constructor(
        private http: HttpClient
    ) {
    }

    getAll(): Observable<any> {
        return this.http.get(this.resourceUrl, { observe: 'response' });
    }

    edit(id: number, params: any): Observable<any> {
        return this.http.put(this.resourceUrl + '/cambiar-valor/' + id, params, { observe: 'response' });
    }

}