import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'app/../environments/environment';

@Injectable()
export class EstadosService {

    private resourceUrl = environment.API_URL + '/estados';

    constructor(
        private http: HttpClient
    ) {
    }

    findAllByPais(paisId: number): Observable<any> {
        return this.http.get(this.resourceUrl + '/by-pais/' + paisId, { observe: 'response' });
    }

}