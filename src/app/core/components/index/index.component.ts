import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { LotesService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, Login, currentUser } from 'app/store';

import { Subject, timer } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

import * as moment from 'moment';
import * as _ from 'lodash';

import { environment } from 'app/../environments/environment';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {

	resourceUrl = environment.URL_IMAGENES;

    data: any;
    lotes: any[];

    page: number;
    limit: number;

    timers: any[];

	images: any[];

	user: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private lotesService: LotesService,
        private domSanitizer: DomSanitizer,
        private store: Store<AppState>,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this._unsubscribeAll = new Subject();

		this.timers = [];
		this.lotes = [];
        this.images = [
            'assets/images/PORTADA-DESCARGAR-CATALOGO.png',
            'assets/images/2-slider.png',
        ];

        this.page = 1;
        this.limit = 20;

		this.load();

		this.store.pipe(
			takeUntil(this._unsubscribeAll),
			select(currentUser),
			filter(user => user)
		).subscribe(user => {
			this.user = user;
		});
    }

    load(): void {
        this.lotesService.allPaginate(this.page, this.limit).subscribe(response => {
			this.data = response.body;
			this.lotes = this.lotes.concat(this.data.items);
			this.timers.forEach(timer => {
				timer.unsubscribe();
			});
			this.timers = [];
            this.timerSubastas(this.lotes);
        },
        err => {
            console.log(err);
        });
    }

    checkIsInPista(item: any): boolean {
        let res = false;

		if (item.lastSubasta) {
			if ((item.lastSubasta.estatus === 'ABIERTO' || item.lastSubasta.estatus === 'EN_PISTA') && item.lastSubasta.activo) {
				res = true;
			}
		}

        return res;
    }

    pujaAqui(item: any): void {
        this.router.navigate(['/subastas/en-pista', item.lastSubasta.id]);
    }

    timerSubastas(lotes: any[]) {
        lotes.forEach((lote, index) => {
			const subasta = lote.lastSubasta;
            if (subasta && (subasta.estatus === 'ABIERTO' || subasta.estatus === 'EN_PISTA')) {
				this.setContador(subasta.fechaFin, index);
            // } else if (subasta && subasta.estatus === 'CREADA') {
			// 	this.setContador(subasta.fechaInicio, index);
			}
        });
	}
	
	setContador(fecha: any, index: number): void {
		const now = moment();
		const newHora = moment(fecha);
		const diff = newHora.diff(now, 'seconds');
		this.lotes[index].tiempo = diff;
		const duration = moment.duration({ 'seconds': this.lotes[index].tiempo });
		const days = duration.days().toString();
		const hours = duration.hours().toString();
		const minutes = duration.minutes().toString();
		const seconds = duration.seconds().toString();
		this.lotes[index].tiempoFormat = (days.length < 2 ? '0' + days : days) + ':' + (hours.length < 2 ? '0' + hours : hours) + ':' + (minutes.length < 2 ? '0' + minutes : minutes) + ':' + (seconds.length < 2 ? '0' + seconds : seconds);

		const time = timer(1000, 1000)
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe(res => {
				this.lotes[index].tiempo--;
				const duration = moment.duration({ 'seconds': this.lotes[index].tiempo });
				const days = duration.days().toString();
				const hours = duration.hours().toString();
				const minutes = duration.minutes().toString();
				const seconds = duration.seconds().toString();
				this.lotes[index].tiempoFormat = (days.length < 2 ? '0' + days : days) + ':' + (hours.length < 2 ? '0' + hours : hours) + ':' + (minutes.length < 2 ? '0' + minutes : minutes) + ':' + (seconds.length < 2 ? '0' + seconds : seconds);
				if (this.lotes[index].tiempo <= 0) {
					time.unsubscribe();
				}
			});

		this.timers.push(time);
	}

    onPageChange(event: any): void {
        this.page = event;
        this.load();
    }

    sanitizeImagen(imagen: any): any {
        return this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + imagen.fotoPortadaContentType + ';base64,' + imagen.fotoPortada);
	}
	
	onScroll(): void {
		this.page = this.page + 1;
		this.onPageChange(this.page);
	}

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}