import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { ToastService, UsersService, ConfigGeneralesService } from 'app/services';

@Component({
    selector: 'app-users-ver',
    templateUrl: './ver.component.html',
    styleUrls: ['./ver.component.css']
})
export class UsersVerComponent implements OnInit {

    configs: any[];

	id: number;
    user: any;

    page: number;
    pageSize: number;

    isTransferencia: boolean;
    isValidar: boolean;

    constructor(
        private usersService: UsersService,
		private activatedRoute: ActivatedRoute,
        private domSanitizer: DomSanitizer,
        private configGeneralesService: ConfigGeneralesService,
        private toastService: ToastService
    ) {
    }

    ngOnInit(): void {
        this.page = 1;
        this.pageSize = 10;

		this.activatedRoute.params.subscribe(params => {
			this.id = +params['id'];
            this.loadConfiguraciones();
		});
    }

    load(): void {
        this.usersService.findOneCompleto(this.id).subscribe(response => {
			this.user = response.body;
            if (this.isTransferencia) {
                this.isValidar = this.user.usersPagos.length > 0;
            } else {
				this.isValidar = true;
			}
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
            this.load();
        },
        err => {
            console.log(err);
        });
    }

    validar(): void {
        this.usersService.validar(this.id).subscribe(response => {
            this.toastService.show('Usuario validado correctamente', { classname: 'bg-success text-light', delay: 10000 });
            this.load();
        },
        err => {
            console.log(err);
        });
	}

    invalidar(): void {
        this.usersService.invalidar(this.id).subscribe(response => {
            this.toastService.show('Usuario invalidado correctamente', { classname: 'bg-success text-light', delay: 10000 });
            this.load();
        },
        err => {
            console.log(err);
        });
    }

    sanitizeImagen(imagen: any): any {
		if (!imagen.archivo) {
			return imagen.url;
		} else {
			return this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + imagen.contentType + ';base64,' + imagen.archivo);
		}
    }


}