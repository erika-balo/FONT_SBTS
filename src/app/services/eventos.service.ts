import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOptionTotal, createRequestOptionPaginate } from 'app/shared/utils/request-utils';

import { environment } from 'app/../environments/environment';

@Injectable()
export class EventosService {

    private resourceUrl = environment.API_URL + '/eventos';

    constructor(
        private http: HttpClient
    ) {
	}

    findAll(): Observable<any> {
        return this.http.get(this.resourceUrl + '/total', { observe: 'response' });
	}

    findAllActivos(): Observable<any> {
        return this.http.get(this.resourceUrl + '/total-activos', { observe: 'response' });
    }

    findAllPaginate(page: number, limit: number, req?: any): Observable<any> {
        const params = createRequestOptionPaginate(page, limit, req);
        return this.http.get(this.resourceUrl, { params: params, observe: 'response' });
    }

    findOne(id: number): Observable<any> {
        return this.http.get(this.resourceUrl + '/' + id, { observe: 'response' });
    }

    save(params: any): Observable<any> {
        return this.http.post(this.resourceUrl, params, { observe: 'response' });
    }

    edit(id: number, params: any): Observable<any> {
        return this.http.put(this.resourceUrl + '/' + id, params, { observe: 'response' });
	}

    inactivar(id: number): Observable<any> {
        return this.http.put(this.resourceUrl + '/inactivar/' + id, {}, { observe: 'response' });
    }

    activar(id: number): Observable<any> {
        return this.http.put(this.resourceUrl + '/activar/' + id, {}, { observe: 'response' });
	}

    findPast(fechaInicial: string): Observable<any> {
        return this.http.get(this.resourceUrl + '/past/' + fechaInicial, { observe: 'response' });
	}

    findFuture(fechaInicial: string): Observable<any> {
        return this.http.get(this.resourceUrl + '/future/' + fechaInicial, { observe: 'response' });
	}

    findCurrent(fecha: string): Observable<any> {
        return this.http.get(this.resourceUrl + '/current/' + fecha, { observe: 'response' });
    }
    
}