
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { SubastasDetallesService, ToastService } from 'app/services';

import { environment } from 'app/../environments/environment';

import { saveAs } from 'file-saver';

@Component({
    selector: 'app-pujas',
    templateUrl: './pujas.component.html',
})
export class VerPujasComponent implements OnInit {

	detalles: any;
	detallesFiltered: any[];

    page: number;
	pageSize: number;

	busquedaForm: FormGroup;

    sortedField: string;
    sortedType: string;

    constructor(
        private _fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
		private subastasDetallesService: SubastasDetallesService,
        private toastService: ToastService,
		private chdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.page = 1;
		this.pageSize = 10;

        this.activatedRoute.params.subscribe(params => {
			this.createForm();

			this.load();

			const url = new URL(environment.MERCURE_URL);
			url.searchParams.append('topic', 'pujas-general');

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

		this.subastasDetallesService.getDetalles(this.page, this.pageSize, req).subscribe(response => {
			this.detalles = response.body;
			this.detallesFiltered = this.detalles.items;
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
	/*prueba inicio ganadora*/


	/*prueba fin ganadora*/
    onPageChange(event: any): void {
        this.page = event;
        this.load();
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
exportCsv(event: any) {
		event.preventDefault();
		this.subastasDetallesService.getDetallesTotal().subscribe(response => {
			const detalles = response.body;
			const data = [];
			if (detalles.length > 0) {
				detalles.map(detalle => {
					const mp = {
						'id_puja': detalle.id,
						'numero_lote': detalle.subasta.lote.numero,
						'nombre_lote': detalle.subasta.lote.nombre,
						'id_cliente': detalle.user.id,
						'nombre_cliente': detalle.user.info.nombre,
						'apellido_paterno_cliente': detalle.user.info.apellidoPaterno,
						'apellido_materno_cliente': detalle.user.info.apellidoMaterno,
						'precio_puja': detalle.monto,
						'fecha_hora_puja': detalle.creado,
						'estatus_puja': detalle.estatus,
						'estatus_lote': detalle.subasta.estatus,
					};

					data.push(mp);
				});
				const replacer = (key, value) => value === null ? '' : value;
				const header = Object.keys(data[0]);
				let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName],replacer)).join(','));
				csv.unshift(header.join(','));
				let csvArray = csv.join('\r\n');
				var blob = new Blob([csvArray], {type: 'text/csv' })
				saveAs(blob, 'pujas.csv');
			} else {
                this.toastService.error('No existen pujas que procesar');
			}
		},
		err => {
			console.log(err);
		});
	}

}
