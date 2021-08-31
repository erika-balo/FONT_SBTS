import { Component, OnInit, OnDestroy } from '@angular/core';

import { ToastService, ConfigGeneralesService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, currentUser } from 'app/store';

import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

@Component({
    selector: 'app-configuraciones-generales',
    templateUrl: './configuraciones-generales.component.html',
    styleUrls: ['./configuraciones-generales.component.css']
})
export class ConfiguracionesGeneralesComponent implements OnInit, OnDestroy {

    configs: any[];

    user: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private configGeneralesService: ConfigGeneralesService,
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
        this.configGeneralesService.getAll().subscribe(response => {
            this.configs = response.body;
        },
        err => {
            console.log(err);
        });
    }

    cambiarValor(item: any, val: boolean): void {
        const params = {
            valor: val
        };
        this.configGeneralesService.edit(item.id, params).subscribe(response => {
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