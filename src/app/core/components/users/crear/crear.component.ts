import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { FilesUtils } from 'app/shared/utils/files-utils';

import { ToastService, UsersService, ConfigDocumentosRegistroService, ConfigFormRegistroService, PaisesService, EstadosService } from 'app/services';

import { forkJoin } from 'rxjs';
import * as _ from 'lodash';

@Component({
    selector: 'app-users-crear',
    templateUrl: './crear.component.html'
})
export class UsersCrearComponent implements OnInit {

	id: number;
    user: any;

    usuarioForm: FormGroup;

    documentosRegistro: any[];
    formsRegistro: any[];

    paises: any[];
	estados: any[];

	filterFields = [
		'estado',
		'ciudad',
		'pais',
	];

    constructor(
        private _fb: FormBuilder,
        private usersService: UsersService,
        private configDocumentosRegistroService: ConfigDocumentosRegistroService,
        private configFormRegistroService: ConfigFormRegistroService,
		private activatedRoute: ActivatedRoute,
        private router: Router,
        private domSanitizer: DomSanitizer,
        private piasesService: PaisesService,
        private estadosService: EstadosService,
        private toastService: ToastService
    ) {
    }

    ngOnInit(): void {
		this.activatedRoute.params.subscribe(params => {
            forkJoin({
                documentos: this.configDocumentosRegistroService.getAllActivos(),
                forms: this.configFormRegistroService.getAll(),
            }).subscribe(response => {
                const dataDocumentos = response.documentos.body;
                this.documentosRegistro = dataDocumentos;

                const data = response.forms.body;
                this.formsRegistro = data;

                this.createForm();
				this.loadPaises();

                this.documentosRegistro.forEach(item => {
                    this.addArchivo(item);
                });
            });
		});
    }

    loadPaises(): void {
        this.piasesService.findAll().subscribe(response => {
            this.paises = response.body;
			this.usuarioForm['controls'].info['controls'].pais.setValue(this.paises[0].id);
			this.loadEstados();
        },
        err => {
            console.log(err);
        });
    }

    loadEstados(): void {
        const pais = this.usuarioForm['controls'].info['controls'].pais.value;
        this.estadosService.findAllByPais(pais).subscribe(response => {
            this.estados = response.body;
			this.usuarioForm['controls'].info['controls'].estado.setValue(this.estados[0].id);
        },
        err => {
            console.log(err);
        });
    }

    createForm(): void {
        this.usuarioForm = this._fb.group({
            info: this._fb.group({
                pais: [null, Validators.required],
                estado: [null, Validators.required],
            }),
            email: [null, Validators.required],
            username: [null, Validators.required],
            password: [null, Validators.required],
            roles: [null, Validators.required],
            archivos: this._fb.array([])
        });

        this.formsRegistro.forEach(form => {
            if (form.seMuestra) {
                const info = <FormGroup>this.usuarioForm['controls'].info;
                info.addControl(form.nombre, new FormControl(null, this.requerido(form.nombre) ? Validators.required : null));
            }
        });
	}

    requerido(nombre: string): boolean {
        let res = false;

        this.formsRegistro.forEach(form => {
            if (form.nombre === nombre && form.requerido) {
                res = true;
                return;
            }
        });

        return res;
	}

	checkIsInFilter(term: string): boolean {
		let res = false;

		this.filterFields.forEach(field => {
			if (field === term) {
				res = true;
				return;
			}
		});

		return res;
	}

    addArchivo(item: any): void {
        const control = <FormArray>this.usuarioForm.controls['archivos'];
        control.push(this.initArchivo(item));
    }

    initArchivo(item: any): FormGroup {
		return this._fb.group({
			base64: [null, Validators.required],
			contentType: [null, Validators.required],
			nombre: [null, Validators.required],
			configDocumentoRegistro: [item.id, Validators.required],
		});
    }

    handleFile(event: any, index: number): void {
        const file = <File>event.target.files[0];
        FilesUtils.readFileBynaryString(file).subscribe(data => {
            const archivos = this.usuarioForm['controls'].archivos as FormArray;
            const control = archivos.at(index);

            control.get('base64').setValue(data.base64);
            control.get('contentType').setValue(file.type);
            control.get('nombre').setValue(file.name);
        });
    }

    getNombreArchivo(index: number): string {
        return this.documentosRegistro && this.documentosRegistro[index].nombre;
    }

    onSubmit(): void {
		const params = this.usuarioForm.value;
		params.username = params.email;
		params.roles = [params.roles];
        this.usersService.save(params).subscribe(response => {
            this.toastService.success('Usuario creado correctamente');
            this.router.navigate(['/page/users']);
        },
        err => {
            console.log(err);
        });
    }

}