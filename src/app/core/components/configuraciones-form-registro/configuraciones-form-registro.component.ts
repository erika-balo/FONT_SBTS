import { Component, OnInit, OnDestroy } from '@angular/core';

import { ToastService, ConfigFormRegistroService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, currentUser } from 'app/store';

import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

@Component({
    selector: 'app-configuraciones-form-registro',
    templateUrl: './configuraciones-form-registro.component.html',
    styleUrls: ['./configuraciones-form-registro.component.css']
})
export class ConfiguracionesFormRegistroComponent implements OnInit, OnDestroy {

    forms: any[];

    user: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private configFormRegistroService: ConfigFormRegistroService,
        private store: Store<AppState>,
        private toastService: ToastService,
    ) {
    }

    ngOnInit(): void {
        this._unsubscribeAll = new Subject();

        this.store.pipe(
            takeUntil(this._unsubscribeAll),
            select(currentUser),
            filter(user => user)
        ).subscribe(user => {
            this.user = user;
            this.load();
        });
    }

    load(): void {
        this.configFormRegistroService.getAll().subscribe(response => {
            this.forms = response.body;
        },
        err => {
            console.log(err);
        });
    }

    requerido(event: any, item: any, val: boolean): void {
        event.preventDefault();
        item.requerido = val;
        this.configFormRegistroService.edit(item.id, item).subscribe(response => {
            this.toastService.success('Registro editado correctamente');
            this.load();
        },
        err => {
            console.log(err);
        });
    }

    seMuestra(event: any, item: any, val: boolean): void {
        event.preventDefault();
        item.seMuestra = val;
        this.configFormRegistroService.edit(item.id, item).subscribe(response => {
            this.toastService.success('Registro editado correctamente');
            this.load();
        },
        err => {
            console.log(err);
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}