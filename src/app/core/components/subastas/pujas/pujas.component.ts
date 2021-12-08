import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { SubastasDetallesService } from 'app/services';

import { environment } from 'app/../environments/environment';

@Component({
    selector: 'app-subasta-pujas',
    templateUrl: './pujas.component.html',
})
export class SubastasVerPujasComponent implements OnInit {

    subastaId: number;

	detalles: any[];

    page: number;
	pageSize: number;

	topicSubasta: string;

	busquedaForm: FormGroup;

    sortedField: string;
    sortedType: string;

    constructor(
        private _fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
		private subastasDetallesService: SubastasDetallesService,
		private chdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.page = 1;
		this.pageSize = 10;

        this.activatedRoute.params.subscribe(params => {
			this.subastaId = +params['subastaId'];
			this.topicSubasta = 'topic-subasta-' + this.subastaId;
			this.createForm();

			this.load();

			const url = new URL(environment.MERCURE_URL);
			url.searchParams.append('topic', this.topicSubasta);

			const eventSource = new EventSource(url.toString());
			eventSource.onmessage = e => {
				this.load();
			};
		});
	}

    createForm(): void {
        this.busquedaForm = this._fb.group({
            cliente: [null],
            montoDesde: [null],
            montoHasta: [null],
            estatus: [null],
        });

		this.busquedaForm.valueChanges.subscribe(values => {
			this.load();
		});
	}

	load(): void {
		if (!this.sortedField) {
			this.sortedField = 'detalles.id';
			this.sortedType = 'DESC';
		}
		const req = this.busquedaForm.value;
		req.sortedField = this.sortedField;
		req.sortedType = this.sortedType;

		this.subastasDetallesService.getDetallesBySubasta(this.subastaId, req).subscribe(response => {
			this.detalles = response.body;
			console.log(this.detalles);
			this.chdr.detectChanges();
		},
		err => {
			console.log(err);
		});
	}

	invalidar(item: any): void {
		this.subastasDetallesService.invalidar(item.id).subscribe(response => {
			this.load();
		},
		err => {
			console.log(err);
		});
	}

	validar(item: any): void {
		this.subastasDetallesService.validar(item.id).subscribe(response => {
			this.load();
		},
		err => {
			console.log(err);
		});
	}

    sorted(field: string): void {
        if (field !== this.sortedField) {
            this.sortedType = 'ASC';
        } else {
            if (this.sortedType === 'ASC') {
                this.sortedType = 'DESC';
            } else {
                this.sortedType = 'ASC';
            }
        }
        this.sortedField = field;
        this.load();
	}

}