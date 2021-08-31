import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { SubastasService } from 'app/services';

import { Subject, timer } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { AppState, Login, currentUser } from 'app/store';

import * as moment from 'moment';
import { environment } from 'app/../environments/environment';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

	resourceUrl = environment.URL_IMAGENES;

    subastas: any[];
    
	timers: any[];

	user: any;

	isSubasta: boolean;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private subastasService: SubastasService,
        private domSanitizer: DomSanitizer,
		private store: Store<AppState>,
		private router: Router
    ) {
    }

    ngOnInit(): void {
        this.timers = [];
        this._unsubscribeAll = new Subject();

		this.loadSubastas();

		this.store.pipe(
			takeUntil(this._unsubscribeAll),
			select(currentUser),
			filter(user => user)
		).subscribe(user => {
			this.user = user;
			this.isSubasta = user.roles.indexOf('ROLE_SUBASTA') >= 0;
		});
    }

    loadSubastas(): void {
        this.subastasService.activasPista().subscribe(response => {
            this.subastas = response.body;
            this.timerSubastas(this.subastas);
        },
        err => {
            console.log(err);
        });
    }

    timerSubastas(subastas: any[]) {
        subastas.forEach((subasta, index) => {
            if (subasta.estatus === 'EN_PISTA' || subasta.estatus === 'ABIERTO') {
                const now = moment();
                const newHora = moment(subasta.fechaFin);
				const diff = newHora.diff(now, 'seconds');
				this.subastas[index].tiempo = diff;
				const duration = moment.duration({ 'seconds': this.subastas[index].tiempo });
				const days = duration.days().toString();
				const hours = duration.hours().toString();
				const minutes = duration.minutes().toString();
				const seconds = duration.seconds().toString();
				this.subastas[index].tiempoFormat = (days.length < 2 ? '0' + days : days) + ':' + (hours.length < 2 ? '0' + hours : hours) + ':' + (minutes.length < 2 ? '0' + minutes : minutes) + ':' + (seconds.length < 2 ? '0' + seconds : seconds);
                const time = timer(1000, 1000)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(res => {
                        this.subastas[index].tiempo--;
						const duration = moment.duration({ 'seconds': this.subastas[index].tiempo });
						const days = duration.days().toString();
						const hours = duration.hours().toString();
						const minutes = duration.minutes().toString();
						const seconds = duration.seconds().toString();
						this.subastas[index].tiempoFormat = (days.length < 2 ? '0' + days : days) + ':' + (hours.length < 2 ? '0' + hours : hours) + ':' + (minutes.length < 2 ? '0' + minutes : minutes) + ':' + (seconds.length < 2 ? '0' + seconds : seconds);
                        if (this.subastas[index].tiempo <= 0) {
							time.unsubscribe();
                        }
                    });

                this.timers.push(time);
            }
        });
    }

    sanitizeImagen(imagen: any): any {
        return this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + imagen.fotoPortadaContentType + ';base64,' + imagen.fotoPortada);
	}
	
	changeToSubastador(item: any): void {
		this.subastasService.enPista(item.id).subscribe(response => {
			this.router.navigate(['/subastador/subastas/en-pista-subastador', item.id]);
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