import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { EventosService, LotesService, SlidersService, BannersService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, Login, currentUser } from 'app/store';

import { Subject, timer } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'app-historial-eventos',
    templateUrl: './historial-eventos.component.html',
    styleUrls: ['./historial-eventos.component.css']
})
export class HistorialEventosComponent implements OnInit, OnDestroy {

	tipo: any;

	eventos: any[];
	eventoSeleccionado: any;

	user: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private lotesService: LotesService,
        private domSanitizer: DomSanitizer,
        private store: Store<AppState>,
		private router: Router,
		private slidersService: SlidersService,
		private bannersService: BannersService,
		private eventosService: EventosService,
		private activatedRoute: ActivatedRoute
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
		});

		this.activatedRoute.queryParams.subscribe(params => {
			this.tipo = params.tipo;
			switch (this.tipo) {
				case 'past':
					this.loadEventosPast();
					break;
				case 'future':
					this.loadEventosFuture();
					break;
			}
		});
	}

	loadEventosPast(): void {
		const now = moment().format('YYYY-MM-DD') + ' 00:00:00';
		this.eventosService.findPast(now).subscribe(response => {
			this.eventos = response.body;
			if (this.eventos.length > 0) {
				this.eventoSeleccionado = this.eventos[0].id;
			}
		},
		err => {
			console.log(err);
		});
	}

	loadEventosFuture(): void {
		const now = moment().format('YYYY-MM-DD') + ' 00:00:00';
		this.eventosService.findFuture(now).subscribe(response => {
			this.eventos = response.body;
			if (this.eventos.length > 0) {
				this.eventoSeleccionado = this.eventos[0].id;
			}
		},
		err => {
			console.log(err);
		});
	}

	changeEvento(event: any): void {
		this.eventoSeleccionado = event;
		this.router.navigate(['/'], { queryParams: { eventoId: this.eventoSeleccionado.id }});
	}
	
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}