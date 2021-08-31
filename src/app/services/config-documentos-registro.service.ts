import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'app/../environments/environment';

@Injectable()
export class ConfigDocumentosRegistroService {

    private resourceUrl = environment.API_URL + '/config-documentos-registro';

    constructor(
        private http: HttpClient
    ) {
    }

    getAll(): Observable<any> {
        return this.http.get(this.resourceUrl, { observe: 'response' });
	}

    getAllActivos(): Observable<any> {
        return this.http.get(this.resourceUrl + '/activos', { observe: 'response' });
    }

    findOne(id: number): Observable<any> {
        return this.http.get(this.resourceUrl + '/' + id, { observe: 'response' });
    }

    save(params: any): Observable<any> {
        return this.http.post(this.resourceUrl, params, { observe: 'response' });
    }

    saveCurrent(params: any): Observable<any> {
        return this.http.post(this.resourceUrl+ '/current', params, { observe: 'response' });
    }

    edit(id: number, params: any): Observable<any> {
        return this.http.put(this.resourceUrl + '/' + id, params, { observe: 'response' });
    }

}