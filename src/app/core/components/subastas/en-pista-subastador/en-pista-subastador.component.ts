import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FilesUtils } from 'app/shared/utils/files-utils';

import { ToastService, SubastasService, SubastasDetallesService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, currentUser } from 'app/store';

import { Subject, timer } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacionComponent } from 'app/core/components/generales/confirmacion/confirmacion.component';
import { CerrarSubastaComponent } from 'app/core/components/subastas/cerrar/cerrar.component';

import * as moment from 'moment';
import * as _ from 'lodash';

import { environment } from 'app/../environments/environment';

@Component({
    selector: 'app-en-pista-subastador',
    templateUrl: './en-pista-subastador.component.html',
    styleUrls: ['./en-pista-subastador.component.css']
})
export class SubastasEnPistaSubastadorComponent implements OnInit, OnDestroy {

	resourceUrl = environment.URL_IMAGENES;

    subastaId: number;
	editMode: boolean = false;
	pujaForm: FormGroup;
	subastaForm: FormGroup;	
	subastasEnPista: any[];

	subasta: any;
	lastPuja: any;
	subastasDetalles: any[];

	topicSubasta: string;

	diferenciaMinimaOferta: number;
	proximaMinimaOferta: number;

	subastaEnPista: boolean;

    isSubasta: boolean;
    isUser: boolean;

    user: any;

    private _unsubscribeAll: Subject<any>;
    
    constructor(
		@Inject(DOCUMENT) document,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _fb: FormBuilder,
		private subastasService: SubastasService,
		private subastasDetallesService: SubastasDetallesService,
		private toastService: ToastService,
        private domSanitizer: DomSanitizer,
        private store: Store<AppState>,
		private modalService: NgbModal,
		private chdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this._unsubscribeAll = new Subject();

		this.loadActivasEnPista();
        this.activatedRoute.params.subscribe(params => {
			this.subastaId = +params['subastaId'];
			this.topicSubasta = 'topic-subasta-' + this.subastaId;

			this.load();
			this.createForm();


			const url = new URL(environment.MERCURE_URL);
			url.searchParams.append('topic', this.topicSubasta);

			const eventSource = new EventSource(url.toString());
			eventSource.onmessage = e => {
				const data = JSON.parse(e.data);
				if (data.accion === 'puja') {
					this.loadDetalles();
				} else if (data.accion === 'vendida') {
					this.load();
				} else if (data.accion === 'cerrar') {
					this.load();
				} else if (data.accion === 'invalidar') {
					this.load();
				} else if (data.accion === 'validar') {
					this.load();
				}else if (data.accion === 'editada') {
					this.load();
				}
			};

			this.store.pipe(
				takeUntil(this._unsubscribeAll),
				select(currentUser),
				filter(user => user)
			).subscribe(user => {
				this.user = user;
				this.isSubasta = user.roles.indexOf('ROLE_SUBASTA') >= 0;
				this.isUser = user.roles.indexOf('ROLE_USER') >= 0;
			});

		});
	}

	load(): void {
		this.subastasService.findOneCompleto(this.subastaId).subscribe(response => {
			this.subasta = response.body;
			console.log(this.subasta);
			this.diferenciaMinimaOferta = this.subasta.diferenciaMinimaOferta;
			this.subastaEnPista = this.subasta.estatus === 'ABIERTO' || this.subasta.estatus === 'EN_PISTA';
			this.createFormlote();
			this.loadDetalles();
			this.editMode = true;

		},
		err => {
			console.log(err);
		});
	}

	loadDetalles(): void {
		this.subastasDetallesService.getDetallesBySubasta(this.subastaId).subscribe(response => {
			this.subastasDetalles = response.body;
			this.lastPuja = _.first(this.subastasDetalles.filter(det => det.estatus !== 'INVALIDA'));
			if (this.subastasDetalles.length > 0) {
				this.proximaMinimaOferta = +this.lastPuja.monto + +this.subasta.diferenciaMinimaOferta;
			} else {
				this.proximaMinimaOferta = this.subasta.precioSalida;
			}

			this.chdr.detectChanges();
		},
		err => {
			console.log(err);
		});
	}

	loadActivasEnPista() {
		this.subastasService.activasPista().subscribe(response => {
			this.subastasEnPista = response.body;
		},
		err => {
			console.log(err);
		});
	}

	invalidar(item: any): void {
		this.subastasDetallesService.invalidar(item.id).subscribe(response => {
			this.loadDetalles();
		},
		err => {
			console.log(err);
		});
	}

	validar(item: any): void {
		this.subastasDetallesService.validar(item.id).subscribe(response => {
			this.loadDetalles();
		},
		err => {
			console.log(err);
		});
	}

	vendida(): void {
		const modalRef = this.modalService.open(CerrarSubastaComponent);
		modalRef.componentInstance.subastaId = this.subastaId;
		modalRef.result.then(result => {
			if (result.res) {
				this.load();
			}
		});
	}

	enPista(): void {
		this.subastasService.enPista(this.subastaId).subscribe(response => {
			this.load();
		},
		err => {
			console.log(err);
		});
	}

    createForm(): void {
        this.pujaForm = this._fb.group({
            monto: [null, Validators.required],
		});
	}
	createFormlote(): void {
		this.subastaForm = this._fb.group({
			precioSalida: [this.subasta.precioSalida, Validators.required],
			sexo:[this.subasta.lote.sexo, Validators.required],
			registro:[this.subasta.lote.registro, Validators.required],
			pesoDestete:[this.subasta.lote.pesoDestete, Validators.required],
			diferenciaMinimaOferta: [this.subasta.diferenciaMinimaOferta, Validators.required],
			subastasPreciosFijos: this._fb.array([])
		});
	}
	isEnPista(): boolean {
		return this.subasta && (this.subasta.estatus === 'ABIERTO' || this.subasta.estatus === 'EN_PISTA');
	}
	
	validDiferenciaPuja(): void {
		const control = this.pujaForm['controls'].monto;
		const value = control.value;

		if (this.lastPuja) {
			const ultimoMonto = this.lastPuja.monto;
			const diff = value - ultimoMonto;
			if (diff < this.subasta.diferenciaMinimaOferta) {
				control.markAllAsTouched();
				control.setErrors({ 'diferenciaMinimaOferta': true });
			} else {
				control.markAllAsTouched();
				control.setErrors(null);
			}
		} else {
			if (value < this.proximaMinimaOferta) {
				control.markAllAsTouched();
				control.setErrors({ 'diferenciaMinimaOferta': true });
			} else {
				control.markAllAsTouched();
				control.setErrors(null);
			}
		}
	}

	descargaPDF(event: any): void {
		event.preventDefault();
		FilesUtils.downloaFile({ base64: this.subasta.lote.informacion, mimeType: this.subasta.lote.informacionContentType, info: { name: this.subasta.lote.informacionNombre } });
	}

    sanitizeImagen(imagen: any): any {
        return this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + imagen.contentType + ';base64,' + imagen.base64);
	}
	
	onSlide(event: any): void {
	}

	get form(): any {
		return this.pujaForm['controls'];
	}

	formatCantidad(cantidad: string): string {
		return parseFloat(cantidad).toFixed(2);
	}

	cantidadFija(cantidad: string): void {
		let ultimoMonto = 0;
		if (this.lastPuja) {
			ultimoMonto = this.lastPuja.monto;
		} else {
			ultimoMonto = this.subasta.precioSalida;
		}

		const total = +cantidad + +ultimoMonto;
		this.pujaForm['controls'].monto.setValue(total);
		this.onSubmit();
	}

    onSubmit(): void {
		this.validDiferenciaPuja();
		if (this.pujaForm.valid) {
			const modalRef = this.modalService.open(ConfirmacionComponent);
			modalRef.componentInstance.texto = '¿Desea registrar esta puja?';
			modalRef.result.then(result => {
				if (result.res) {
					this.registrarPuja();
				}
			});
		}
    }
	onSubmitlote(): void {
		if (this.subastaForm.valid) {
			const params = this.subastaForm.value;
			this.subasta.precioSalida = params.precioSalida;
			this.subasta.diferenciaMinimaOferta = params.diferenciaMinimaOferta;
			this.subasta.lote.id = params.lote;
			this.subasta.evento.id = params.evento;
			
			this.subastasService.edit(this.subasta.id, params).subscribe(
					response => {
						console.log('Subasta actualizada correctamente', response);
						this.editMode = false;
					},
					error => {
						console.error('Error al actualizar la subasta', error);
					}
				);
		}
	}
	registrarPuja(): void {
		const params = this.pujaForm.value;
		params.topic = this.topicSubasta;
		params.data = { accion: 'puja' };
		params.tipo = this.isUser ? 'INTERNET' : 'PISO';
		this.subastasDetallesService.save(this.subastaId, params).subscribe(response => {
			this.loadDetalles();
			this.pujaForm.reset();
			this.toastService.success('Puja registrada correctamente');
		},
		err => {
			console.log(err);
			if (err.status === 409) {
				this.toastService.error(err.error.message);
			}
		});
	}

	changeSubasta(event: any): void {
		const subastaId = event.target.value;
		this.subastasService.enPista(subastaId).subscribe(response => {
			this.router.navigate(['/page/subastas/en-pista-subastador', subastaId]);
		},
		err => {
			console.log(err);
		});
	}

	ngOnDestroy() : void {
	}

}
