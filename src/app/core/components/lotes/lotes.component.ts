import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { LotesService, ToastService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, currentUser } from 'app/store';

import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

import { environment } from 'app/../environments/environment';

@Component({
    selector: 'app-lotes',
    templateUrl: './lotes.component.html',
    styleUrls: ['./lotes.component.css']
})
export class LotesComponent implements OnInit, OnDestroy {

	resourceUrl = environment.URL_IMAGENES;

    lotes: any[];
    lotesFiltered: any[];

    page: number;
    pageSize: number;

    user: any;
    isAdmin: boolean;

    sortedField: string;
    sortedType: string;

    busquedaForm: FormGroup;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fb: FormBuilder,
        private lotesService: LotesService,
        private store: Store<AppState>,
        private domSanitizer: DomSanitizer,
        private toastService: ToastService
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
            this.lotesFiltered = this.search(value);
        });
    }

    load(): void {
        if (this.isAdmin) {
            this.lotesService.findAll({ sorted: this.sortedField ? this.sortedField : 'lote.id', sortedType: this.sortedType ? this.sortedType : 'DESC' }).subscribe(response => {
                this.lotes = response.body;
		console.log(this.lotes);
                this.lotesFiltered = this.lotes;
            },
            err => {
                console.log(err);
            });
        } else {
            this.lotesService.findAllCurrent({ sorted: this.sortedField ? this.sortedField : 'lote.id', sortedType: this.sortedType ? this.sortedType : 'DESC' }).subscribe(response => {
                this.lotes = response.body;
                this.lotesFiltered = this.lotes;
            },
            err => {
                console.log(err);
            });
        }
    }

    sanitizeImagen(imagen: any): any {
        return this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + imagen.contentType + ';base64,' + imagen.base64);
	}

    activar(item: any): void {
        this.lotesService.activar(item.id).subscribe(response => {
			this.toastService.success('Edicion correcta');
            this.load();
        },
        err => {
            console.log(err);
        });
    }

    inactivar(item: any): void {
        this.lotesService.inactivar(item.id).subscribe(response => {
			this.toastService.success('Edicion correcta');
            this.load();
        },
        err => {
            console.log(err);
        });
    }

    search(text: string): any[] {
        return this.lotes.filter(rancho => {
            const term = text.toLowerCase();
            return rancho.numero.toLowerCase().includes(term)
            || rancho.nombre.toLowerCase().includes(term);
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
