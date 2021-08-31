import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { FilesUtils } from 'app/shared/utils/files-utils';

import { ToastService, UsersService, ConfigDocumentosRegistroService, ConfigFormRegistroService, PaisesService, EstadosService } from 'app/services';

import { forkJoin } from 'rxjs';
import * as _ from 'lodash';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';

@Component({
    selector: 'app-users-editar',
    templateUrl: './editar.component.html',
    styleUrls: ['./editar.component.css']
})
export class UsersEditarComponent implements OnInit {

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
        this.loadPaises();
		this.activatedRoute.params.subscribe(params => {
			this.id = +params['id'];
            forkJoin({
                documentos: this.configDocumentosRegistroService.getAllActivos(),
                forms: this.configFormRegistroService.getAll(),
                user: this.usersService.findOneCompleto(this.id)
            }).subscribe(response => {
                const dataDocumentos = response.documentos.body;
                this.documentosRegistro = dataDocumentos;

                const data = response.forms.body;
                this.formsRegistro = data;

				this.user = response.user.body;
				console.log(this.user);

                this.createForm();

                this.documentosRegistro.forEach(item => {
                    this.addArchivo(item);
                });
            });
		});
    }

    loadPaises(): void {
        this.piasesService.findAll().subscribe(response => {
            this.paises = response.body;
        },
        err => {
            console.log(err);
        });
    }

    loadEstados(): void {
        const pais = this.usuarioForm['controls'].info['controls'].pais.value;
        this.estadosService.findAllByPais(pais).subscribe(response => {
            this.estados = response.body;
        },
        err => {
            console.log(err);
        });
    }

    createForm(): void {
        this.usuarioForm = this._fb.group({
            info: this._fb.group({
                id: [this.user.info.id],
                pais: [this.user.info.estado.pais.id, Validators.required],
                estado: [this.user.info.estado.id, Validators.required],
            }),
            email: [this.user.email, Validators.required],
            username: [this.user.username, Validators.required],
            archivos: this._fb.array([])
        });

        this.formsRegistro.forEach(form => {
            if (form.seMuestra) {
                const info = <FormGroup>this.usuarioForm['controls'].info;
                info.addControl(form.nombre, new FormControl(this.user.info[form.nombre], this.requerido(form.nombre) ? Validators.required : null));
            }
        });

        this.loadEstados();
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
        const doc = this.getDocumento(item.id);
        if (doc) {
            return this._fb.group({
                id: [doc.id],
                base64: [doc.archivo, Validators.required],
                contentType: [doc.contentType, Validators.required],
                nombre: [doc.nombre, Validators.required],
                configDocumentoRegistro: [doc.configDocumentoRegistro.id, Validators.required],
            });
        } else {
            return this._fb.group({
                base64: [null, Validators.required],
                contentType: [null, Validators.required],
                nombre: [null, Validators.required],
                configDocumentoRegistro: [item.id, Validators.required],
            });
        }
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

    sanitizeAndCheckImagen(child: any, index: number): any {
		const value = child.value;
        const configDocumentoRegistro = value.configDocumentoRegistro;
        const doc = this.getDocumento(configDocumentoRegistro);
        if (doc) {
			if (doc.url) {
				return doc.url;
			} else {
				return this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + doc.contentType + ';base64,' + value.base64);
			}
        }
    }

    getDocumento(id: number): any {
        let doc = null;
        this.user.usersDocumentos.forEach(docu => {
            if (docu.configDocumentoRegistro.id === id) {
                doc = docu;
                return;
            }

        });

        return doc;
    }

    onSubmit(): void {
        this.usersService.editar(this.id, this.usuarioForm.value).subscribe(response => {
            this.toastService.success('Usuario editado correctamente');
            this.router.navigate(['/page/users']);
        },
        err => {
            console.log(err);
        });
    }

}