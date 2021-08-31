import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ToastService, UsersDevolucionesService } from 'app/services';

@Component({
    selector: 'app-users-devolucion-crear',
    templateUrl: './crear.component.html',
    styleUrls: ['./crear.component.css']
})
export class UsersDevolucionCrearComponent implements OnInit {

    id: number;
    userId: number;

    devolucionForm: FormGroup;

    devolucion: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _fb: FormBuilder,
        private usersDevolucionesService: UsersDevolucionesService,
        private toastService: ToastService
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.userId = params.userId;
            if (params['id']) {
                this.id = +params['id'];
                this.load();
            } else {
                this.devolucion = {};
                this.devolucion.user = {};
                this.createForm();
            }
        });
    }

    load(): void {
        this.usersDevolucionesService.getOneCompleto(this.id).subscribe(response => {
            this.devolucion = response.body;
            this.createForm();
        },
        err => {
            console.log(err);
        });
    }

    createForm(): void {
        this.devolucionForm = this._fb.group({
            monto: [this.devolucion.monto],
            fechaPago: [this.devolucion.fechaPago, Validators.required],
            fechaDevolucion: [this.devolucion.fechaDevolucion, Validators.required],
            medioPago: [this.devolucion.medioPago, Validators.required],
        });
    }

    isEdit(): boolean {
        return this.devolucion.id ? true : false;
    }

    onSubmit(): void {
        if (!this.devolucionForm.valid) {
            return;
        }

        const params = this.devolucionForm.value;
        if (this.isEdit()) {
            this.usersDevolucionesService.edit(this.id, params).subscribe(response => {
                this.toastService.success('Devolucion editado correctamente');
                this.router.navigate(['/page/users-devoluciones/' + this.userId]);
            },
            err => {
                console.log(err);
            });
        } else {
            this.usersDevolucionesService.crearPago(this.userId, params).subscribe(response => {
                this.toastService.success('Devolucion creado correctamente');
                this.router.navigate(['/page/users-devoluciones/' + this.userId]);
            },
            err => {
                console.log(err);
            });
        }
    }

}