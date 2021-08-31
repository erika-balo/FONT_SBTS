import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOptionTotal } from 'app/shared/utils/request-utils';

import { environment } from 'app/../environments/environment';

@Injectable()
export class LotesService {

    private resourceUrl = environment.API_URL + '/lotes';

    constructor(
        private http: HttpClient
    ) {
    }

    findAll(req?: any): Observable<any> {
        const params = createRequestOptionTotal(req);
        return this.http.get(this.resourceUrl, { params: params, observe: 'response' });
	}

    findAllActivos(req?: any): Observable<any> {
        const params = createRequestOptionTotal(req);
        return this.http.get(this.resourceUrl + '/activos', { params: params, observe: 'response' });
    }

    findAllCurrent(req?: any): Observable<any> {
        const params = createRequestOptionTotal(req);
        return this.http.get(this.resourceUrl + '/current', { params: params, observe: 'response' });
    }

    findOne(id: number): Observable<any> {
        return this.http.get(this.resourceUrl + '/' + id, { observe: 'response' });
    }

    findOneCompleto(id: number): Observable<any> {
        return this.http.get(this.resourceUrl + '/completo/' + id, { observe: 'response' });
    }

    save(params: any): Observable<any> {
        return this.http.post(this.resourceUrl, params, { observe: 'response' });
    }

    edit(id: number, params: any): Observable<any> {
        return this.http.put(this.resourceUrl + '/' + id, params, { observe: 'response' });
    }

    allPaginate(page: number, limit: number): Observable<any> {
        return this.http.get(this.resourceUrl + '/all/paginate?page=' + page + '&limit=' + limit, { observe: 'response' });
	}

    allPaginateByUserCurent(page: number, limit: number): Observable<any> {
        return this.http.get(this.resourceUrl + '/all/paginate/by-user-current?page=' + page + '&limit=' + limit, { observe: 'response' });
    }

    inactivar(id: number): Observable<any> {
        return this.http.put(this.resourceUrl + '/inactivar/' + id, {}, { observe: 'response' });
    }

    activar(id: number): Observable<any> {
        return this.http.put(this.resourceUrl + '/activar/' + id, {}, { observe: 'response' });
    }
    
}