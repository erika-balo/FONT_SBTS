import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { ToastService, UsersService } from 'app/services';

@Component({
	selector: 'app-auth-re-password-finish',
	templateUrl: './auth-re-password-finish.component.html',
	styleUrls: ['./auth-re-password-finish.component.css']
})
export class AuthRePasswordFinishComponent implements OnInit {

	token: string;

	cambioForm: UntypedFormGroup;

	loading: boolean;

	constructor(
        private _fb: UntypedFormBuilder,
        private toastService: ToastService,
		private usersService: UsersService,
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {
	}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe(params => {
			this.token = params.token;
			this.createForm();
		});
	}

    createForm(): void {
        this.cambioForm = this._fb.group({
            nuevoPassword: [null, Validators.required],
        });
	}

	get f(): any { 
        return this.cambioForm['controls'];
	}; 

    onSubmit(): void {
		const isValid = this.cambioForm.valid;
		if (!isValid) {
			this.cambioForm.markAllAsTouched();
			return;
		}

		this.loading = true;
		const params = this.cambioForm.value;
        this.usersService.cambiarPasswordFinish(this.token, params).subscribe(response => {
			this.toastService.success('Cambio de contraseña correcto');
			this.router.navigate(['/auth-login']);
			this.loading = false;
        },
        err => {
            console.log(err);
			this.toastService.error(err.error.message);
			this.loading = false;
        });
    }

}