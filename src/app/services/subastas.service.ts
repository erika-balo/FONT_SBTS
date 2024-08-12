import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOptionTotal, createRequestOptionPaginate } from 'app/shared/utils/request-utils';

import { environment } from 'app/../environments/environment';

@Injectable()
export class SubastasService {

    private resourceUrl = environment.API_URL + '/subastas';

    constructor(
        private http: HttpClient
    ) {
    }

    findAll(req?: any): Observable<any> {
        const params = createRequestOptionTotal(req);
        return this.http.get(this.resourceUrl, { params: params, observe: 'response' });
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

    enPista(id: number): Observable<any> {
        return this.http.put(this.resourceUrl + '/en-pista/' + id, {}, { observe: 'response' });
    }

    vendida(id: number, params: any = {}): Observable<any> {
        return this.http.put(this.resourceUrl + '/vendida/' + id, params, { observe: 'response' });
	}
	abierto(id: number, params: any = {}): Observable<any> {
        return this.http.put(this.resourceUrl + '/abierto/' + id, params, { observe: 'response' });
        }
	
	
    activa(id: number): Observable<any> {
        return this.http.put(this.resourceUrl + '/activa/' + id, {}, { observe: 'response' });
	}

    inactiva(id: number): Observable<any> {
        return this.http.put(this.resourceUrl + '/inactiva/' + id, {}, { observe: 'response' });
    }

    activasPista(): Observable<any> {
        return this.http.get(this.resourceUrl + '/activas-en-pista/current', { observe: 'response' });
    }

    cambiarEstatus(id: number, params: any): Observable<any> {
        return this.http.put(this.resourceUrl + '/cambiar-estatus/' + id, params, { observe: 'response' });
	}

    getEnPista(): Observable<any> {
        return this.http.get(this.resourceUrl + '/completo/one/en-pista', { observe: 'response' });
	}

    getCurrent(): Observable<any> {
        return this.http.get(this.resourceUrl + '/by-user/current', { observe: 'response' });
    }
findOneCompletoEnPista(): Observable<any> {
        return this.http.get(this.resourceUrl + '/completo/one/en-pista', { observe: 'response' });
	}
}
