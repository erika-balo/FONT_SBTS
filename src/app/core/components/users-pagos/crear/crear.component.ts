import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ToastService, UsersPagosService } from 'app/services';


@Component({
    selector: 'app-users-pagos-crear',
    templateUrl: './crear.component.html',
    styleUrls: ['./crear.component.css']
})
export class UsersPagosCrearComponent implements OnInit {

    id: number;
    userId: number;

    pagoForm: FormGroup;

    pago: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _fb: FormBuilder,
        private usersPagosService: UsersPagosService,
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
                this.pago = {};
                this.pago.user = {};
                this.createForm();
            }
        });
    }

    load(): void {
        this.usersPagosService.getOneCompleto(this.id).subscribe(response => {
            this.pago = response.body;
            this.createForm();
        },
        err => {
            console.log(err);
        });
    }

    createForm(): void {
        this.pagoForm = this._fb.group({
            monto: [this.pago.monto],
            fechaPago: [this.pago.fechaPago, Validators.required],
            banco: [this.pago.banco, Validators.required],
            referencia: [this.pago.referencia, Validators.required],
        });
    }

    isEdit(): boolean {
        return this.pago.id ? true : false;
    }

    onSubmit(): void {
        if (!this.pagoForm.valid) {
            return;
        }

        const params = this.pagoForm.value;
        if (this.isEdit()) {
            this.usersPagosService.edit(this.id, params).subscribe(response => {
                this.toastService.success('Pago editado correctamente');
                this.router.navigate(['/page/users-pagos/' + this.userId]);
            },
            err => {
                console.log(err);
            });
        } else {
            this.usersPagosService.crearPago(this.userId, params).subscribe(response => {
                this.toastService.success('Pago creado correctamente');
                this.router.navigate(['/page/users-pagos/' + this.userId]);
            },
            err => {
                console.log(err);
            });
        }
    }

}