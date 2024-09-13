import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray } from '@angular/forms';

import { EventosService, ToastService } from 'app/services';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacionComponent } from 'app/core/components/generales/confirmacion/confirmacion.component';

import { Store, select } from '@ngrx/store';
import { AppState, currentUser } from 'app/store';

import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

@Component({
    selector: 'app-eventos',
    templateUrl: './eventos.component.html',
    styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

    eventos: any;
    eventosFiltered: any[];

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
        private store: Store<AppState>,
		private modalService: NgbModal,
        private eventosService: EventosService,
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

			this.createForm();
            this.load();
        });
	}

    createForm(): void {
        this.busquedaForm = this._fb.group({
            nombre: [null],
            desde: [null],
            hasta: [null],
        });

		this.busquedaForm.valueChanges.subscribe(values => {
			this.load();
		});
	}

    load(): void {
		if (!this.sortedField) {
			this.sortedField = 'user.id';
			this.sortedType = 'DESC';
		}
		const req = this.busquedaForm.value;
		req.sortedField = this.sortedField;
		req.sortedType = this.sortedType;

        this.eventosService.findAllPaginate(this.page, this.pageSize, req).subscribe(response => {
            this.eventos = response.body;
            this.eventosFiltered = this.eventos.items;;
        },
        err => {
            console.log(err);
        });
	}

    confirmActivar(item: any): void {
        const modalRef = this.modalService.open(ConfirmacionComponent);
        modalRef.componentInstance.texto = '¿Desea activar este evento?';
        modalRef.result.then(result => {
            if (result.res) {
                this.activar(item);
            }
        });
	}

    confirmInactivar(item: any): void {
        const modalRef = this.modalService.open(ConfirmacionComponent);
        modalRef.componentInstance.texto = '¿Desea inactivar este evento?';
        modalRef.result.then(result => {
            if (result.res) {
                this.inactivar(item);
            }
        });
    }

    activar(item: any): void {
        this.eventosService.activar(item.id).subscribe(response => {
			this.toastService.success('Edicion correcta');
            this.load();
        },
        err => {
            console.log(err);
        });
    }

    inactivar(item: any): void {
        this.eventosService.inactivar(item.id).subscribe(response => {
			this.toastService.success('Edicion correcta');
            this.load();
        },
        err => {
            console.log(err);
        });
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

}