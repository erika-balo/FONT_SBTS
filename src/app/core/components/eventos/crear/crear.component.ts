import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ToastService, EventosService } from 'app/services';

import * as moment from 'moment';

@Component({
    selector: 'app-eventos-crear',
    templateUrl: './crear.component.html',
    styleUrls: ['./crear.component.css']
})
export class EventosCrearComponent implements OnInit {

    id: number;

    eventoForm: FormGroup;

    evento: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _fb: FormBuilder,
        private eventosService: EventosService,
        private toastService: ToastService
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.id = +params['id'];
                this.load();
            } else {
                this.evento = {};
                this.evento.fechaInicio = moment();
                this.evento.fechaFin = moment();
                this.createForm();
            }
        });
    }

    load(): void {
        this.eventosService.findOne(this.id).subscribe(response => {
            this.evento = response.body;
            this.createForm();
        },
        err => {
            console.log(err);
        });
    }

    createForm(): void {
        this.eventoForm = this._fb.group({
            nombre: [this.evento.nombre, Validators.required],
            descripcion: [this.evento.descripcion, Validators.required],
            prefijo: [this.evento.prefijo, Validators.required],
            fechaInicio: [this.evento.fechaInicio, Validators.required],
            fechaFin: [this.evento.fechaFin, Validators.required],
        });
    }

    isEdit(): boolean {
        return this.evento.id ? true : false;
    }

    onSubmit(): void {
        const params = this.eventoForm.value;
        if (this.isEdit()) {
            this.eventosService.edit(this.id, params).subscribe(response => {
                this.toastService.success('Evento editado correctamente');
                this.router.navigate(['/page/eventos']);
            },
            err => {
                console.log(err);
            });
        } else {
            this.eventosService.save(params).subscribe(response => {
                this.toastService.success('Evento creado correctamente');
                this.router.navigate(['/page/eventos']);
            },
            err => {
                console.log(err);
            });
        }
    }

}