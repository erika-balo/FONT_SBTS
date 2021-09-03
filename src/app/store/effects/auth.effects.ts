import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AppState } from 'app/store/app.states';
import { AuthActionTypes, Login, UserRequested, UserLoaded } from 'app/store/actions/auth.actions';
import { isUserLoaded } from 'app/store/selectors/auth.selector';

import { tap, withLatestFrom, mergeMap } from 'rxjs/operators';

import { UsersService } from 'app/services';

@Injectable()
export class AuthEffects {

    constructor(
        private actions: Actions,
        private router: Router,
        private store: Store<AppState>,
        private usersService: UsersService
    ) {
    }

    @Effect({dispatch: false})
    login$ = this.actions.pipe(
        ofType<Login>(AuthActionTypes.Login),
        tap(action => {
            localStorage.setItem('access_token', action.payload.token);
            this.store.dispatch(new UserRequested());
        }),
    );

    @Effect({dispatch: false})
    loadUser$ = this.actions
    .pipe(
        ofType<UserRequested>(AuthActionTypes.UserRequested),
        withLatestFrom(this.store.pipe(select(isUserLoaded))),
        mergeMap(([action, _isUserLoaded]) => this.usersService.me()),
        tap(response => {
			const _user = response.body;
            this.store.dispatch(new UserLoaded({ user: _user }));
        })
    );

}
