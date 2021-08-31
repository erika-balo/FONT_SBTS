import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { SubastasDetallesService, SubastasService } from 'app/services';

@Component({
	selector: 'cerrar-subasta-modal',
	templateUrl: './cerrar.component.html'
})
export class CerrarSubastaComponent implements OnInit {

	@Input()
	subastaId: number;

    subastaForm: FormGroup;

	constructor(
		public activeModal: NgbActiveModal,
        private _fb: FormBuilder,
		private subastasDetallesService: SubastasDetallesService,
		private subastasService: SubastasService
	) {
	}

	ngOnInit(): void {
		this.createForm();
	}

    createForm(): void {
        this.subastaForm = this._fb.group({
            nuevoMonto: [null],
        });
    }

	onSubmit(): void {
		this.subastasService.vendida(this.subastaId, this.subastaForm.value).subscribe(response => {
			this.activeModal.close({ res: true, data: response });
		},
		err => {
			console.log(err);
		});
	}

}