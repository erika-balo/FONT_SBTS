import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { SubastasDetallesService } from 'app/services';

@Component({
	selector: 'puja-ganadora-modal',
	templateUrl: './ganadora.component.html'
})
export class GanadoraComponent implements OnInit {

	@Input()
	id: number;

    ganadoraForm: FormGroup;

	constructor(
		public activeModal: NgbActiveModal,
        private _fb: FormBuilder,
		private subastasDetallesService: SubastasDetallesService
	) {
	}

	ngOnInit(): void {
		this.createForm();
	}

    createForm(): void {
        this.ganadoraForm = this._fb.group({
            motivo: ['', Validators.required],
        });
    }

	onSubmit(): void {
		this.subastasDetallesService.ganadora(this.id, this.ganadoraForm.value).subscribe(response => {
			this.activeModal.close(response);
		},
		err => {
			console.log(err);
		});
	}

}