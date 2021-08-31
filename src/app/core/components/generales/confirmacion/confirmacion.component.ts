import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'confirmacion',
	templateUrl: './confirmacion.component.html'
})
export class ConfirmacionComponent implements OnInit {

	@Input()
	texto: number;

	constructor(
		public activeModal: NgbActiveModal,
	) {
	}

	ngOnInit(): void {
	}

	aceptar(): void {
		this.activeModal.close({ res: true });
	}

	no(): void {
		this.activeModal.close({ res: false });
	}

}