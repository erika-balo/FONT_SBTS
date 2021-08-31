import { createSelector } from '@ngrx/store';

export const selectAuthState = state => state.auth;

export const currentUser = createSelector(
    selectAuthState,
    auth => auth.user
);

export const isUserLoaded = createSelector(
    selectAuthState,
    auth => auth.isUserLoaded
);

export const isLogeedIn = createSelector(
    selectAuthState,
    auth => auth.isLoggedIn
);