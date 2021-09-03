import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { ToastService, ConfigDocumentosRegistroService, UsersService, ConfigFormRegistroService, PaisesService, EstadosService } from 'app/services';

import { FilesUtils } from 'app/shared/utils/files-utils';

import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-auth-signup',
    templateUrl: './auth-signup.component.html',
    styleUrls: ['./auth-signup.component.css']
})
export class AuthSignupComponent implements OnInit {

    registroForm: FormGroup;

    documentosRegistro: any[];
    formsRegistro: any[];

    paises: any[];
	estados: any[];
	
	filterFields = [
		'estado',
		'ciudad',
		'pais',
	];

	loading: boolean;

    constructor(
        private _fb: FormBuilder,
        private configDocumentosRegistroService: ConfigDocumentosRegistroService,
        private configFormRegistroService: ConfigFormRegistroService,
        private usersService: UsersService,
        private toastService: ToastService,
        private paisesService: PaisesService,
        private estadosService: EstadosService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        forkJoin({
            documentos: this.configDocumentosRegistroService.getAllActivos(),
            forms: this.configFormRegistroService.getAll()
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
    }

    loadPaises(): void {
        this.paisesService.findAll().subscribe(response => {
			this.paises = response.body;
			this.registroForm['controls'].info['controls'].pais.setValue(this.paises[0].id);
			this.loadEstados();
        },
        err => {
            console.log(err);
        });
    }

    loadEstados(): void {
        const pais = this.registroForm['controls'].info['controls'].pais.value;
        this.estadosService.findAllByPais(pais).subscribe(response => {
            this.estados = response.body;
			this.registroForm['controls'].info['controls'].estado.setValue(this.estados[0].id);
        },
        err => {
            console.log(err);
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

    createForm(): void {
        this.registroForm = this._fb.group({
            info: this._fb.group({
                pais: [null, Validators.required],
                estado: [null, Validators.required],
                ciudad: [null, Validators.required],
            }),
            email: [null, Validators.required],
            username: [null],
            password: [null, Validators.required],
            terminos: [null, Validators.required],
            archivos: this._fb.array([])
        });

		this.registroForm.get('email').valueChanges.subscribe((event) => {
			this.registroForm.get('email').setValue(event.toLowerCase(), {emitEvent: false});
		})

        this.formsRegistro.forEach(form => {
            if (form.seMuestra) {
                const info = <FormGroup>this.registroForm['controls'].info;
                info.addControl(form.nombre, new FormControl('', this.requerido(form.nombre) ? Validators.required : null));
            }
        });
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
        const control = <FormArray>this.registroForm.controls['archivos'];
        control.push(this.initArchivo(item));
    }

    initArchivo(item: any): FormGroup {
        return this._fb.group({
            base64: ['', Validators.required],
            contentType: ['', Validators.required],
            nombre: ['', Validators.required],
            configDocumentoRegistro: [item.id, Validators.required],
        });
    }

    getNombreArchivo(index: number): string {
        return this.documentosRegistro && this.documentosRegistro[index].nombre;
	}

    getRequeridoArchivo(index: number): boolean {
        return this.documentosRegistro && this.documentosRegistro[index].requerido;
    }

    handleFile(event: any, index: number): void {
        const file = <File>event.target.files[0];
        FilesUtils.readFileBynaryString(file).subscribe(data => {
            const archivos = this.registroForm['controls'].archivos as FormArray;
            const control = archivos.at(index);

            control.get('base64').setValue(data.base64);
            control.get('contentType').setValue(file.type);
            control.get('nombre').setValue(file.name);
        });
    }

    loadDocumentos(): void {
        this.configDocumentosRegistroService.getAll().subscribe(response => {
            const data = response.body;
            this.documentosRegistro = data;
            this.documentosRegistro.forEach(item => {
                this.addArchivo(item);
            });
        },
        err => {
            console.log(err);
        });
    }

    loadForms(): void {
        this.configFormRegistroService.getAll().subscribe(response => {
            const data = response.body;
            this.formsRegistro = data;
        },
        err => {
            console.log(err);
        });
	}
	
	get f(): any { 
        return this.registroForm['controls']
	}; 

	get fInfo(): any { 
        return this.registroForm['controls'].info['controls']
	}; 

	get fArchivos(): any { 
        return this.registroForm['controls'].archivos['controls']
    }; 

    onSubmit(): void {
		const isValid = this.registroForm.valid;
		if (!isValid) {
			this.registroForm.markAllAsTouched();
			return;
		}

		this.loading = true;
		const params = this.registroForm.value;
		params.username = params.email;
        this.usersService.register(params).subscribe(response => {
            this.toastService.success('Usuario Registrado correctamente, se envió un email al correo registrado');
            this.router.navigate(['/auth-login']);
			this.loading = false;
        },
        err => {
            console.log(err);
            this.toastService.error(err.error.message);
			this.loading = false;
        });
    }

}
