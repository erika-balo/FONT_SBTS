import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { ToastService, LotesService, RanchosService } from 'app/services';

import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FilesUtils } from 'app/shared/utils/files-utils';

import { Store, select } from '@ngrx/store';
import { AppState, currentUser } from 'app/store';

import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

import { environment } from 'app/../environments/environment';

@Component({
    selector: 'app-lotes-crear',
    templateUrl: './crear.component.html',
    styleUrls: ['./crear.component.css']
})
export class LotesCrearComponent implements OnInit, OnDestroy {

	resourceUrl = environment.URL_IMAGENES;

    id: number;

    loteForm: FormGroup;

    ranchos: any[];

    lote: any;

    files: any[] = [];
    fotoPortada: any;
    fichaTecnica: any;

    isAdmin: boolean;
    isUser: boolean;

    user: any;

    private _unsubscribeAll: Subject<any>;

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '200px',
        minHeight: '0',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'Enter text here...',
        defaultParagraphSeparator: '',
        defaultFontName: '',
        defaultFontSize: '',
        fonts: [
            {class: 'arial', name: 'Arial'},
            {class: 'times-new-roman', name: 'Times New Roman'},
            {class: 'calibri', name: 'Calibri'},
            {class: 'comic-sans-ms', name: 'Comic Sans MS'}
        ],
        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
        // uploadUrl: 'v1/image',
        // upload: (file: File) => { ... }
        // uploadWithCredentials: false,
        // sanitize: true,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            ['bold', 'italic'],
            ['fontSize']
        ]
    };

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _fb: FormBuilder,
        private lotesService: LotesService,
        private domSanitizer: DomSanitizer,
        private store: Store<AppState>,
        private ranchosService: RanchosService,
        private toastService: ToastService
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.id = +params['id'];
                this.load();
            } else {
                this.lote = {};
                this.lote.rancho = {};
                this.createForm();
            }
        });

        this._unsubscribeAll = new Subject();

        this.store.pipe(
            takeUntil(this._unsubscribeAll),
            select(currentUser),
            filter(user => user)
        ).subscribe(user => {
            this.user = user;
            this.isAdmin = user.roles.indexOf('ROLE_ADMIN') >= 0;
            this.isUser = user.roles.indexOf('ROLE_USER') >= 0;
            this.loadRanchos();
        });
    }

    load(): void {
        this.lotesService.findOneCompleto(this.id).subscribe(response => {
            this.lote = response.body;
            this.createForm();

            this.lote.lotesFotos.forEach(loteFoto => {
                this.addFoto(loteFoto);
                this.files.push({ nombre: loteFoto.fotoNombre, fotoUrl: loteFoto.fotoUrl, archivoFoto: loteFoto.archivoFoto });
            });
        },
        err => {
            console.log(err);
        });
    }

    loadRanchos(): void {
        if (this.isAdmin) {
            this.ranchosService.findAllActivos().subscribe(response => {
                this.ranchos = response.body;
            },
            err => {
                console.log(err);
            });
        } else {
            this.ranchosService.findAllCurrentActivos().subscribe(response => {
                this.ranchos = response.body;
            },
            err => {
                console.log(err);
            });
        }
    }

    createForm(): void {
        this.loteForm = this._fb.group({
            numero: [this.lote.numero, Validators.required],
            nombre: [this.lote.nombre, Validators.required],
            descripcion: [this.lote.descripcion, Validators.required],
            informacionAnimal: [this.lote.informacionAnimal, Validators.required],
            linkYoutube: [this.lote.linkYoutube, Validators.required],
            linkPdf: [this.lote.linkPdf, Validators.required],
            padre: [this.lote.padre, Validators.required],
            madre: [this.lote.madre, Validators.required],
            abuelaPaterna: [this.lote.abuelaPaterna, Validators.required],
            abuelaMaterna: [this.lote.abuelaMaterna, Validators.required],
            abueloPaterno: [this.lote.abueloPaterno, Validators.required],
            abueloMaterno: [this.lote.abueloMaterno, Validators.required],
            bisabueloAbuelaPaterna: [this.lote.bisabueloAbuelaPaterna, Validators.required],
            bisabuelaAbuelaPaterna: [this.lote.bisabuelaAbuelaPaterna, Validators.required],
            bisabueloAbuelaMaterna: [this.lote.bisabueloAbuelaMaterna, Validators.required],
            bisabuelaAbuelaMaterna: [this.lote.bisabuelaAbuelaMaterna, Validators.required],
            bisabueloAbueloPaterno: [this.lote.bisabueloAbueloPaterno, Validators.required],
            bisabuelaAbueloPaterno: [this.lote.bisabuelaAbueloPaterno, Validators.required],
            bisabueloAbueloMaterno: [this.lote.bisabueloAbueloMaterno, Validators.required],
            bisabuelaAbueloMaterno: [this.lote.bisabuelaAbueloMaterno, Validators.required],
            rancho: [this.lote.rancho ? this.lote.rancho.id : null, Validators.required],
            color: [this.lote.color, Validators.required],
            sexo: [this.lote.sexo, Validators.required],
            fechaNacimiento: [this.lote.fechaNacimiento, Validators.required],
            registro: [this.lote.registro, Validators.required],
            pesoNacer: [this.lote.pesoNacer, Validators.required],
            pesoDestete: [this.lote.pesoDestete, Validators.required],

            base64Portada: [null],
            fotoPortadaContentType: [null],
            fotoPortadaNombre: [null],

            base64FichaTecnica: [null],
            fichaTecnicaContentType: [null],
            fichaTecnicaNombre: [null],

            base64Informacion: [null],
            informacionContentType: [null],
            informacionNombre: [null],

            fotos: this._fb.array([])
        });
    }

    handleFile(event: any): void {
        const file = <File>event.target.files[0];
        FilesUtils.readFileBynaryString(file).subscribe(data => {
            this.loteForm.get('base64Portada').setValue(data.base64);
            this.loteForm.get('fotoPortadaContentType').setValue(file.type);
            this.loteForm.get('fotoPortadaNombre').setValue(file.name);

			this.fotoPortada = { base64: data.base64, contentType: data.type };
        });
    }

    handleFileFicha(event: any): void {
        const file = <File>event.target.files[0];
        FilesUtils.readFileBynaryString(file).subscribe(data => {
            this.loteForm.get('base64FichaTecnica').setValue(data.base64);
            this.loteForm.get('fichaTecnicaContentType').setValue(file.type);
            this.loteForm.get('fichaTecnicaNombre').setValue(file.name);

            this.fichaTecnica = { base64: data.base64, contentType: data.type };
        });
    }

    handleFileInformacion(event: any): void {
        const file = <File>event.target.files[0];
        FilesUtils.readFileBynaryString(file).subscribe(data => {
            this.loteForm.get('base64Informacion').setValue(data.base64);
            this.loteForm.get('informacionContentType').setValue(file.type);
            this.loteForm.get('informacionNombre').setValue(file.name);
        });
    }

    dropped(files: NgxFileDropEntry[]): void {
        files.forEach(droppedFile => {
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    FilesUtils.readFileBynaryString(file).subscribe(data => {
                        this.addFoto({ base64: data.base64, fotoContentType: file.type, fotoNombre: file.name });
                        this.files.push({ nombre: file.name, base64: data.base64, contentType: file.type });
                    });
                });
            }
        });
    }

    addFoto(item: any): void {
        const fotos = <FormArray>this.loteForm.controls['fotos'];
        fotos.push(this.initFoto(item));
    }

    initFoto(item: any): FormGroup {
        if (item.id) {
            return this._fb.group({
                id: [item.id],
                base64: [item.base64],
                fotoContentType: [item.fotoContentType],
                fotoNombre: [item.fotoNombre],
                fotoUrl: [item.fotoUrl],
            });
        } else {
            return this._fb.group({
                base64: [item.base64],
                fotoContentType: [item.fotoContentType],
                fotoNombre: [item.fotoNombre],
            });
        }
    }

    eliminarFoto(index: number): void {
        this.files.splice(index, 1);
        
        const fotos = <FormArray>this.loteForm.controls['fotos'];
        fotos.removeAt(index);
    }

    public fileOver(event){
        console.log(event);
    }

    public fileLeave(event){
        console.log(event);
    }

    sanitizeImagen(imagen: any): any {
        return this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + imagen.contentType + ';base64,' + imagen.base64);
    }

    isEdit(): boolean {
        return this.lote.id ? true : false;
    }

    onSubmit(): void {
		const params = this.loteForm.value;
        if (this.isEdit()) {
            this.lotesService.edit(this.id, params).subscribe(response => {
                this.toastService.success('Lote editado correctamente');
                this.router.navigate(['/page/lotes']);
            },
            err => {
                console.log(err);
            });
        } else {
            this.lotesService.save(params).subscribe(response => {
                this.toastService.success('Lote creado correctamente');
                this.router.navigate(['/page/lotes']);
            },
            err => {
                console.log(err);
            });
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}

