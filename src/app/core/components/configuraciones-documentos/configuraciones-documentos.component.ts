import { Component, OnInit, OnDestroy } from '@angular/core';

import { ConfigDocumentosRegistroService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, currentUser } from 'app/store';

import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

@Component({
    selector: 'app-configuraciones-documentos',
    templateUrl: './configuraciones-documentos.component.html',
    styleUrls: ['./configuraciones-documentos.component.css']
})
export class ConfiguracionesDocumentosComponent implements OnInit, OnDestroy {

    documentos: any[];

    page: number;
    pageSize: number;

    user: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private configDocumentosRegistroService: ConfigDocumentosRegistroService,
        private store: Store<AppState>,
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
            this.load();
        });
    }

    load(): void {
        this.configDocumentosRegistroService.getAll().subscribe(response => {
            this.documentos = response.body;
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