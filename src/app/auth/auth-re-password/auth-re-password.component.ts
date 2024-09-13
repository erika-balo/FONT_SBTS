import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { ToastService, UsersService } from 'app/services';

@Component({
	selector: 'app-auth-re-password',
	templateUrl: './auth-re-password.component.html',
	styleUrls: ['./auth-re-password.component.css']
})
export class AuthRePasswordComponent implements OnInit {

	cambioForm: UntypedFormGroup;

	loading: boolean;

	constructor(
        private _fb: UntypedFormBuilder,
        private toastService: ToastService,
		private usersService: UsersService
	) {
	}

	ngOnInit(): void {
		this.createForm();
	}

    createForm(): void {
        this.cambioForm = this._fb.group({
            username: [null, Validators.required],
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
        this.usersService.cambiarPasswordInit(params).subscribe(response => {
            this.toastService.success('Si el correo esta dado de alta en nuestro sistema se enviara un correo la dirección de correo proporcionada para recuperar la contraseña');
			this.loading = false;
        },
        err => {
            console.log(err);
            this.toastService.success('Si el correo esta dado de alta en nuestro sistema se enviara un correo la dirección de correo proporcionada para recuperar la contraseña');
			this.loading = false;
        });
    }

}