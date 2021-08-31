import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { UsersService } from 'app/services';

@Component({
	selector: 'cambio-password-modal',
	templateUrl: './cambio-password.component.html'
})
export class CambioPasswordComponent implements OnInit {

	@Input()
	userId: number;

    cambioForm: FormGroup;

	constructor(
		public activeModal: NgbActiveModal,
        private _fb: FormBuilder,
		private usersService: UsersService
	) {
	}

	ngOnInit(): void {
		this.createForm();
	}

    createForm(): void {
        this.cambioForm = this._fb.group({
            password: [null, Validators.required],
        });
    }

	onSubmit(): void {
		this.usersService.cambiarPassword(this.userId, this.cambioForm.value).subscribe(response => {
			this.activeModal.close(response);
		},
		err => {
			console.log(err);
		});
	}

}