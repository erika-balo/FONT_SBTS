import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray } from '@angular/forms';

import { RanchosService, ToastService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, currentUser } from 'app/store';

import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

@Component({
    selector: 'app-ranchos',
    templateUrl: './ranchos.component.html',
    styleUrls: ['./ranchos.component.css']
})
export class RanchosComponent implements OnInit, OnDestroy {

    ranchos: any[];
    ranchosFiltered: any[];

    page: number;
    pageSize: number;

    user: any;
    isAdmin: boolean;

    sortedField: string;
    sortedType: string;

    busquedaForm: UntypedFormGroup;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fb: UntypedFormBuilder,
        private ranchosService: RanchosService,
        private store: Store<AppState>,
		private toastService: ToastService,
    ) {
    }

    ngOnInit(): void {
        this.page = 1;
        this.pageSize = 10;

        this._unsubscribeAll = new Subject();

        this.store.pipe(
            takeUntil(this._unsubscribeAll),
            select(currentUser),
            filter(user => user)
        ).subscribe(user => {
            this.user = user;
            this.isAdmin = user.roles.indexOf('ROLE_ADMIN') >= 0;
            this.load();
            this.createForm();
        });
    }

    createForm(): void {
        this.busquedaForm = this._fb.group({
            busqueda: [null],
        });

        this.busquedaForm['controls'].busqueda.valueChanges.subscribe(value => {
            this.ranchosFiltered = this.search(value);
        });
    }

    load(): void {
        if (this.isAdmin) {
            this.ranchosService.findAll({ sorted: this.sortedField ? this.sortedField : 'rancho.id', sortedType: this.sortedType ? this.sortedType : 'DESC' }).subscribe(response => {
                this.ranchos = response.body;
                this.ranchosFiltered = this.ranchos;
            },
            err => {
                console.log(err);
            });
        } else {
            this.ranchosService.findAllCurrent({ sorted: this.sortedField ? this.sortedField : 'rancho.id', sortedType: this.sortedType ? this.sortedType : 'DESC' }).subscribe(response => {
                this.ranchos = response.body;
                this.ranchosFiltered = this.ranchos;
            },
            err => {
                console.log(err);
            });
        }
    }

    search(text: string): any[] {
        return this.ranchos.filter(rancho => {
            const term = text.toLowerCase();
            return rancho.nombre.toLowerCase().includes(term)
            || rancho.titular.toLowerCase().includes(term)
            || rancho.email.toLowerCase().includes(term)
            || rancho.telefonoContacto.toLowerCase().includes(term);
        });
    }

    activar(item: any): void {
        this.ranchosService.activar(item.id).subscribe(response => {
			this.toastService.success('Edicion correcta');
            this.load();
        },
        err => {
            console.log(err);
        });
    }

    inactivar(item: any): void {
        this.ranchosService.inactivar(item.id).subscribe(response => {
			this.toastService.success('Edicion correcta');
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

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}