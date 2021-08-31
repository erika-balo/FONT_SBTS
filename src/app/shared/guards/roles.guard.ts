import { Injectable } from '@angular/core';
import {
	CanActivate, Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';

import { select, Store } from '@ngrx/store';
import { AppState, currentUser } from 'app/store';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators'

import * as _ from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {

	user: any;

    constructor(
		private router: Router,
		private store: Store<AppState>,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
		return this.store.pipe(
            select(currentUser),
            filter(user => user),
            map(user => {
				const roles = route.data.roles;
				const intersection = _.intersection(user.roles, roles);
                return intersection.length > 0;
            })
        );
    }

}