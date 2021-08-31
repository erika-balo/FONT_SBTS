import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'app/../environments/environment';

@Injectable()
export class UsersPagosService {

    private resourceUrl = environment.API_URL + '/users-pagos';

    constructor(
        private http: HttpClient
    ) {
    }

    getOneCompleto(id: number): Observable<any> {
        return this.http.get(this.resourceUrl + '/completo/' + id, { observe: 'response' });
    }

    getAllByUser(id: number): Observable<any> {
        return this.http.get(this.resourceUrl + '/by-user/' + id, { observe: 'response' });
    }

    crearPago(id: number, params: any): Observable<any> {
        return this.http.post(this.resourceUrl + '/by-user/' + id, params, { observe: 'response' });
    }

    edit(id: number, params: any): Observable<any> {
        return this.http.put(this.resourceUrl + '/' + id, params, { observe: 'response' });
    }

}