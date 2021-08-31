import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOptionTotal, createRequestOptionPaginate } from 'app/shared/utils/request-utils';

import { environment } from 'app/../environments/environment';

@Injectable()
export class SubastasDetallesService {

    private resourceUrl = environment.API_URL + '/subastas-detalles';

    constructor(
        private http: HttpClient
    ) {
    }

    save(id: number, params: any): Observable<any> {
        return this.http.post(this.resourceUrl + '/by-subasta/' + id + '/current', params, { observe: 'response' });
	}

    getDetalles(page: number, limit: number, req?: any): Observable<any> {
        const params = createRequestOptionPaginate(page, limit, req);
        return this.http.get(this.resourceUrl, { params: params, observe: 'response' });
	}

    getDetallesTotal(): Observable<any> {
        return this.http.get(this.resourceUrl + '/all/total', { observe: 'response' });
    }

    getDetallesLimit(id: number): Observable<any> {
        return this.http.get(this.resourceUrl + '/by-subasta/' + id + '/limit', { observe: 'response' });
	}

    getDetallesBySubasta(id: number, req?: any): Observable<any> {
        const params = createRequestOptionTotal(req);
        return this.http.get(this.resourceUrl + '/by-subasta/' + id, { params: params, observe: 'response' });
    }

    ganadora(id: number, params: any): Observable<any> {
        return this.http.put(this.resourceUrl + '/ganadora/' + id, params, { observe: 'response' });
	}
	
    invalidar(id: number): Observable<any> {
        return this.http.put(this.resourceUrl + '/invalidar/' + id, {}, { observe: 'response' });
	}

    validar(id: number): Observable<any> {
        return this.http.put(this.resourceUrl + '/validar/' + id, {}, { observe: 'response' });
    }

}