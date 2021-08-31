import { AuthActionTypes, AuthActions } from 'app/store/actions/auth.actions';

export interface AuthState {
    isLoggedIn: boolean;
    token: string;
    user: any;
    isUserLoaded: boolean;
}

export const initialAuthState: AuthState = {
    isLoggedIn: false,
    token: undefined,
    user: undefined,
    isUserLoaded: false,
}

export function authReducer(state = initialAuthState, action: AuthActions): AuthState {
    switch (action.type) {
        case AuthActionTypes.Login: {
            const token = action.payload.token;
            return {
                isLoggedIn: true,
                token: token,
                user: undefined,
                isUserLoaded: false,
            };
        }

        case AuthActionTypes.Logout:
            localStorage.removeItem('access_token');
            return initialAuthState;

        case AuthActionTypes.UserLoaded: {
            const _user = action.payload.user;
            return {
                ...state,
                user: _user,
                isUserLoaded: true
            };
        }

        default:
            return state;
    }

}