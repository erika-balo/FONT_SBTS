import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { ToastService, EventosService, LotesService, SubastasService } from 'app/services';

import * as moment from 'moment';

@Component({
    selector: 'app-subastas-crear',
    templateUrl: './crear.component.html',
    styleUrls: ['./crear.component.css']
})
export class SubastasCrearComponent implements OnInit {

    id: number;

    subastaForm: FormGroup;

    subasta: any;
    
    lotes: any[];
    eventos: any[];

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _fb: FormBuilder,
        private subastasService: SubastasService,
        private lotesService: LotesService,
        private eventosService: EventosService,
        private toastService: ToastService
    ) {
    }

    ngOnInit(): void {
        this.loadLotes();
        this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.id = +params['id'];
                this.load();
            } else {
                this.subasta = {};
                this.subasta.lote = {};
                this.subasta.evento = {};
                this.subasta.fechaInicio = moment();
                this.subasta.fechaFin = moment();
                this.createForm();
				this.loadEventos();
            }
        });
    }

    load(): void {
        this.subastasService.findOneCompleto(this.id).subscribe(response => {
            this.subasta = response.body;
			this.createForm();
			this.loadEventos();

			this.subastaForm.addControl('estatus', new FormControl(this.subasta.estatus, Validators.required));

			this.subasta.subastasPreciosFijos.forEach(precioFijo => {
				this.addPrecioFijo(precioFijo);
			});
        },
        err => {
            console.log(err);
        });
    }

    loadLotes(): void {
        this.lotesService.findAllActivos().subscribe(response => {
            this.lotes = response.body;
        },
        err => {
            console.log(err);
        });
    }

    loadEventos(): void {
        this.eventosService.findAllActivos().subscribe(response => {
			this.eventos = response.body;
			if (this.eventos.length > 0 && !this.subasta.id) {
				this.subastaForm['controls'].evento.setValue(this.eventos[0].id);
			}
        },
        err => {
            console.log(err);
        });
    }

    createForm(): void {
        this.subastaForm = this._fb.group({
            fechaInicio: [this.subasta.fechaInicio, Validators.required],
            fechaInicioTime: [{ hour: moment(this.subasta.fechaInicio).hour(), minute: moment(this.subasta.fechaInicio).minute() }, Validators.required],
            fechaFin: [this.subasta.fechaFin, Validators.required],
            fechaFinTime: [{ hour: moment(this.subasta.fechaFin).hour(), minute: moment(this.subasta.fechaFin).minute() }, Validators.required],
            precioSalida: [this.subasta.precioSalida, Validators.required],
            diferenciaMinimaOferta: [this.subasta.diferenciaMinimaOferta, Validators.required],
            minutosAntesCerrar: [this.subasta.minutosAntesCerrar, Validators.required],
            tiempoAumentaFin: [this.subasta.tiempoAumentaFin, Validators.required],
            lote: [this.subasta.lote.id, Validators.required],
            evento: [this.subasta.evento.id, Validators.required],
            archivos: this._fb.array([]),
            subastasPreciosFijos: this._fb.array([])
        });
	}

    addPrecioFijo(item: any = {}): void {
        const control = <FormArray>this.subastaForm.controls['subastasPreciosFijos'];
        control.push(this.initPrecioFijo(item));
    }

    initPrecioFijo(item: any): FormGroup {
		if (this.isEdit()) {
			return this._fb.group({
				id: [item.id],
				cantidad: [item.cantidad, Validators.required],
				subasta: [this.subasta.id]
			});
		} else {
			return this._fb.group({
				cantidad: [item.cantidad, Validators.required],
			});
		}
	}

    eliminarPrecioFijo(index: number): void {
        const fotos = <FormArray>this.subastaForm.controls['subastasPreciosFijos'];
        fotos.removeAt(index);
    }

    isEdit(): boolean {
        return this.subasta.id ? true : false;
    }

    onSubmit(): void {
		const params = this.subastaForm.value;
		params.fechaInicio = moment(moment(params.fechaInicio).format('YYYY-MM-DD') + ' ' + params.fechaInicioTime.hour.toString().padStart(2, '0') + ':' + params.fechaInicioTime.minute.toString().padStart(2, '0'));
		params.fechaFin = moment(moment(params.fechaFin).format('YYYY-MM-DD') + ' ' + params.fechaFinTime.hour.toString().padStart(2, '0') + ':' + params.fechaFinTime.minute.toString().padStart(2, '0'));
        if (this.isEdit()) {
            this.subastasService.edit(this.id, params).subscribe(response => {
                this.toastService.success('Subasta editada correctamente');
                this.router.navigate(['/page/subastas']);
            },
            err => {
                console.log(err);
            });
        } else {
            this.subastasService.save(params).subscribe(response => {
                this.toastService.success('Subasta creada correctamente');
                this.router.navigate(['/page/subastas']);
            },
            err => {
                console.log(err);
            });
        }
    }

}