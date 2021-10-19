import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOptionTotal, createRequestOptionPaginate } from 'app/shared/utils/request-utils';

import { environment } from 'app/../environments/environment';

@Injectable()
export class UsersService {

    private resourceUrl = environment.API_URL + '/users';

    constructor(
        private http: HttpClient
    ) {
    }

    register(params: any): Observable<any> {
        return this.http.post(this.resourceUrl + '/register', params, { observe: 'response' });
    }
    
    me(): Observable<any> {
        return this.http.get(this.resourceUrl + '/me', { observe: 'response' });
    }

    getAllUsers(page: number, limit: number, req?: any): Observable<any> {
        const params = createRequestOptionPaginate(page, limit, req);
        return this.http.get(this.resourceUrl + '/users', { params: params, observe: 'response' });
	}

    getAllUsersTotal(): Observable<any> {
        return this.http.get(this.resourceUrl + '/users-total', { observe: 'response' });
    }

    findOneCompleto(id: number): Observable<any> {
        return this.http.get(this.resourceUrl + '/completo/' + id, { observe: 'response' });
    }

    editar(id: number, params: any): Observable<any> {
        return this.http.put(this.resourceUrl + '/' + id, params, { observe: 'response' });
	}

    save(params: any): Observable<any> {
        return this.http.post(this.resourceUrl, params, { observe: 'response' });
    }

    validar(id: number): Observable<any> {
        return this.http.put(this.resourceUrl + '/validar/' + id, {}, { observe: 'response' });
	}

    invalidar(id: number): Observable<any> {
        return this.http.put(this.resourceUrl + '/invalidar/' + id, {}, { observe: 'response' });
    }

    activar(id: number): Observable<any> {
        return this.http.put(this.resourceUrl + '/activar/' + id, {}, { observe: 'response' });
    }

    inactivar(id: number): Observable<any> {
        return this.http.put(this.resourceUrl + '/inactivar/' + id, {}, { observe: 'response' });
    }

    cambiarPassword(id: number, params: any): Observable<any> {
        return this.http.put(this.resourceUrl + '/cambiar-password/' + id, params, { observe: 'response' });
	}

    cambiarPasswordInit(params: any): Observable<any> {
        return this.http.put(this.resourceUrl + '/cambio-password/init', params, { observe: 'response' });
	}

    cambiarPasswordFinish(token: string, params: any): Observable<any> {
        return this.http.put(this.resourceUrl + '/cambio-password/finish/' + token, params, { observe: 'response' });
    }

}