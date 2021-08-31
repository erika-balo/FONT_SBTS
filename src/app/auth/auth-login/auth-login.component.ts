import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastService, AuthService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, Login, currentUser } from 'app/store';

import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

@Component({
    selector: 'app-auth-login',
    templateUrl: './auth-login.component.html',
    styleUrls: ['./auth-login.component.css']
})
export class AuthLoginComponent implements OnInit, OnDestroy {

    loginForm: FormGroup;

	redirectUrl: string;
	
	loading: boolean;

	user: any;

    private _unsubscribeAll: Subject<any>;

	constructor(
        private _fb: FormBuilder,
        private store: Store<AppState>,
        private authService: AuthService,
        private toastService: ToastService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
    }

	ngOnInit(): void {
		this._unsubscribeAll = new Subject();

        this.activatedRoute.queryParams.subscribe(params => {
            if (params.redirectUrl) {
                this.redirectUrl = params.redirectUrl;
            }
        });
        this.createForm();
    }

    createForm(): void {
        this.loginForm = this._fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    onSubmit(): void {
        this.authService.login(this.loginForm.value).subscribe(response => {
			this.store.dispatch(new Login({token: response.body.access_token}));

			this.store.pipe(
				takeUntil(this._unsubscribeAll),
				select(currentUser),
				filter(user => user)
			).subscribe(user => {
				this.user = user;
				if (this.redirectUrl) {
					this.router.navigate([this.redirectUrl]);
				} else {
					const isUser = user.roles.indexOf('ROLE_USER') >= 0;
					if (isUser) {
						this.router.navigate(['/']);
					} else {
						this.router.navigate(['/page/dashboard']);
					}
				}
			});
        },
        err => {
            console.log(err);
            if (err.status === 401) {
                this.toastService.error(err.error.message);
            }
        });
	}

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
