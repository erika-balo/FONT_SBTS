import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray } from '@angular/forms';

import { UsersService, ToastService, PaisesService, EstadosService, ConfigGeneralesService } from 'app/services';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CambioPasswordComponent } from './cambio-password/cambio-password.component';
import { ConfirmacionComponent } from 'app/core/components/generales/confirmacion/confirmacion.component';

import * as moment from 'moment';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

    configs: any[];

    users: any;
    usersFiltered: any[];

    page: number;
    pageSize: number;

    isTransferencia: boolean;
    isValidar: boolean;

    sortedField: string;
    sortedType: string;

	busquedaForm: UntypedFormGroup;

    paises: any[];
	estados: any[];

    constructor(
        private _fb: UntypedFormBuilder,
        private usersService: UsersService,
		private toastService: ToastService,
        private configGeneralesService: ConfigGeneralesService,
        private paisesService: PaisesService,
        private estadosService: EstadosService,
		private modalService: NgbModal
    ) {
    }

    ngOnInit(): void {
        this.page = 1;
        this.pageSize = 10;

		this.createForm();

		this.loadPaises();
        this.loadConfiguraciones();
        this.load();
    }

    createForm(): void {
        this.busquedaForm = this._fb.group({
            nombre: [null],
            apellidoPaterno: [null],
            apellidoMaterno: [null],
            estado: [null],
            pais: [null],
            desde: [null],
            hasta: [null],
            activo: [null],
            validado: [null],
        });

		this.busquedaForm.valueChanges.subscribe(values => {
			this.load();
		});
	}

    loadPaises(): void {
        this.paisesService.findAll().subscribe(response => {
            this.paises = response.body;
        },
        err => {
            console.log(err);
        });
    }

    loadEstados(): void {
        const pais = this.busquedaForm['controls'].pais.value;
        this.estadosService.findAllByPais(pais).subscribe(response => {
            this.estados = response.body;
        },
        err => {
            console.log(err);
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

        this.usersService.getAllUsers(this.page, this.pageSize, req).subscribe(response => {
            this.users = response.body;
            this.usersFiltered = this.users.items;
        },
        err => {
            console.log(err);
        });
    }

    loadConfiguraciones(): void {
        this.configGeneralesService.getAll().subscribe(response => {
            this.configs = response.body;
            this.configs.forEach(config => {
                if (config.slug === 'ACTIVACION_TRANSFERENCIA') {
                    if (config.valor === 'true') {
                        this.isTransferencia = true;
                    }
                }
            });
        },
        err => {
            console.log(err);
        });
	}
	
	checkIsValidar(user: any): boolean {
		if (this.isTransferencia) {
			return user.usersPagos.length > 0;
		} else {
			return true;
		}
	}

	openCambioPassword(item: any): void {
		const modalRef = this.modalService.open(CambioPasswordComponent);
		modalRef.componentInstance.userId = item.id;
		modalRef.result.then(result => {
			this.toastService.success('Cambio de Password correcto');
		});
	}

    confirmValidar(item: any): void {
        const modalRef = this.modalService.open(ConfirmacionComponent);
        modalRef.componentInstance.texto = '¿Desea validar este usuario?';
        modalRef.result.then(result => {
            if (result.res) {
                this.validar(item);
            }
        });
	}

    confirmInvalidar(item: any): void {
        const modalRef = this.modalService.open(ConfirmacionComponent);
        modalRef.componentInstance.texto = '¿Desea invalidar este usuario?';
        modalRef.result.then(result => {
            if (result.res) {
                this.invalidar(item);
            }
        });
    }

    confirmActivar(item: any): void {
        const modalRef = this.modalService.open(ConfirmacionComponent);
        modalRef.componentInstance.texto = '¿Desea activar este usuario?';
        modalRef.result.then(result => {
            if (result.res) {
                this.activar(item);
            }
        });
    }

    activar(item: any): void {
        this.usersService.activar(item.id).subscribe(response => {
            this.load();
        },
        err => {
            console.log(err);
        });
    }

    confirmInactivar(item: any): void {
        const modalRef = this.modalService.open(ConfirmacionComponent);
        modalRef.componentInstance.texto = '¿Desea inactivar este usuario?';
        modalRef.result.then(result => {
            if (result.res) {
                this.inactivar(item);
            }
        });
    }

    inactivar(item: any): void {
        this.usersService.inactivar(item.id).subscribe(response => {
            this.load();
        },
        err => {
            console.log(err);
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

    onPageChange(event: any): void {
        this.page = event;
        this.load();
    }

    validar(item: any): void {
        this.usersService.validar(item.id).subscribe(response => {
            this.toastService.show('Usuario validado correctamente', { classname: 'bg-success text-light', delay: 10000 });
            this.load();
        },
        err => {
            console.log(err);
        });
	}

    invalidar(item: any): void {
        this.usersService.invalidar(item.id).subscribe(response => {
            this.toastService.show('Usuario invalidado correctamente', { classname: 'bg-success text-light', delay: 10000 });
            this.load();
        },
        err => {
            console.log(err);
        });
	}

	exportCsv(event: any) {
		event.preventDefault();
		this.usersService.getAllUsersTotal().subscribe(response => {
			const detalles = response.body;
			const data = [];
			if (detalles.length > 0) {
				detalles.forEach(detalle => {
					const mp = {
						'id': detalle.id,
						'nombre': detalle.info.nombre,
						'apellido_paterno': detalle.info.apellidoPaterno,
						'apellido_materno': detalle.info.apellidoMaterno,
						'activo': detalle.activo,
						'validado': detalle.validado,
						'correo_electronico': detalle.email,
						'telefono': detalle.info.telefono,
						'ciudad': detalle.info.estado.nombre,
						'pais': detalle.info.estado.pais.nombre,
						'fecha_registro': moment(detalle.info).format('DD/MM/YYYY'),
					};

					data.push(mp);
				});
				const replacer = (key, value) => value === null ? '' : value;
				const header = Object.keys(data[0]);
				let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName],replacer)).join(','));
				csv.unshift(header.join(','));
				let csvArray = csv.join('\r\n');
				var blob = new Blob([csvArray], {type: 'text/csv' })
				saveAs(blob, 'usuarios.csv');
			} else {
                this.toastService.error('No existen usuarios que procesar');
			}
		},
		err => {
			console.log(err);
		});
	}

}