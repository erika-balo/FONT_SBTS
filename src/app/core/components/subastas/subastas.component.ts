import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { SubastasService } from 'app/services';

@Component({
    selector: 'app-eventos',
    templateUrl: './subastas.component.html',
    styleUrls: ['./subastas.component.css']
})
export class SubastasComponent implements OnInit {

    subastas: any[];

    page: number;
	pageSize: number;

	busquedaForm: FormGroup;

    sortedField: string;
    sortedType: string;

    constructor(
        private _fb: FormBuilder,
        private subastasService: SubastasService
    ) {
    }

    ngOnInit(): void {
        this.page = 1;
        this.pageSize = 10;

		this.createForm();

        this.load();
	}

    createForm(): void {
        this.busquedaForm = this._fb.group({
            numeroLote: [null],
            nombreLote: [null],
            estatus: [null],
        });

		this.busquedaForm.valueChanges.subscribe(values => {
			this.load();
		});
	}

    load(): void {
		if (!this.sortedField) {
			this.sortedField = 'subastasDetalles.id';
			this.sortedType = 'DESC';
		}
		const req = this.busquedaForm.value;
		req.sortedField = this.sortedField;
		req.sortedType = this.sortedType;

        this.subastasService.findAll(req).subscribe(response => {
			this.subastas = response.body;
        },
        err => {
            console.log(err);
        });
    }

    enPista(item: any): void {
        this.subastasService.enPista(item.id).subscribe(response => {
            this.load();
        },
        err => {
            console.log(err);
        });
	}
	
	activar(item: any): void {
		this.subastasService.activa(item.id).subscribe(response => {
			this.load();
		},
		err => {
			console.log(err);
		});
	}

	inactivar(item: any): void {
		this.subastasService.inactiva(item.id).subscribe(response => {
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