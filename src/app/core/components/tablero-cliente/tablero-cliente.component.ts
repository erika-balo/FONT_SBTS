import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { LotesService, SubastasService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, Login, currentUser } from 'app/store';

import { Subject, timer } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

import * as moment from 'moment';
import * as _ from 'lodash';

import { environment } from 'app/../environments/environment';

@Component({
    selector: 'app-tablero-cliente',
    templateUrl: './tablero-cliente.component.html',
})
export class TableroClienteComponent implements OnInit, OnDestroy {

	resourceUrl = environment.URL_IMAGENES;

    subastas: any;
    subastasFiltered: any;

    page: number;
	limit: number;

    sortedField: string;
    sortedType: string;

	user: any;

	busquedaForm: FormGroup;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fb: FormBuilder,
        private lotesService: LotesService,
        private domSanitizer: DomSanitizer,
        private store: Store<AppState>,
		private router: Router,
		private subastasService: SubastasService
    ) {
    }

    ngOnInit(): void {
        this._unsubscribeAll = new Subject();

        this.page = 1;
		this.limit = 10;

		this.store.pipe(
			takeUntil(this._unsubscribeAll),
			select(currentUser),
			filter(user => user)
		).subscribe(user => {
			this.user = user;
			this.createForm();
			this.load();
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

	isLider(lastPuja: any): string {
		let isLider = 'NA';

		if (lastPuja) {
			if (lastPuja.user.id === this.user.id) {
				isLider = 'Sí';
			} else {
				isLider = 'No';
			}
		}

		return isLider;
	}

    load(): void {
        this.subastasService.getCurrent().subscribe(response => {
			this.subastas = response.body;
			this.subastas.forEach(sub => {
				const topicSubasta = 'topic-subasta-' + sub.id;
				const url = new URL(environment.MERCURE_URL);
				url.searchParams.append('topic', topicSubasta);

				const eventSource = new EventSource(url.toString());
				eventSource.onmessage = e => {
					console.log(e);
					this.load();
				};
			});
        },
        err => {
            console.log(err);
        });
    }

    checkIsInPista(item: any): boolean {
        let res = false;

        item.subastas.forEach(subasta => {
            if (subasta.estatus === 'ABIERTO' || subasta.estatus === 'EN_PISTA') {
                res = true;
			}
			if (subasta.estatus === 'VENDIDA') {
				res = false;
			}
        });

        return res;
    }

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

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}