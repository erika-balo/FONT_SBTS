import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { FilesUtils } from 'app/shared/utils/files-utils';
import { ToastService, EventosService } from 'app/services';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
@Component({
    selector: 'app-eventos-crear',
    templateUrl: './crear.component.html',
    styleUrls: ['./crear.component.css']
})
export class EventosCrearComponent implements OnInit {

    id: number;
	  files: any[] = [];
    eventoForm: FormGroup;
    fotoPortada: any;
    evento: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _fb: FormBuilder,
	 private domSanitizer: DomSanitizer,
        private eventosService: EventosService,
        private toastService: ToastService
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.id = +params['id'];
		console.log(this.id);
                this.load();
            } else {
                this.evento = {};
                this.evento.fechaInicio = moment();
                this.evento.fechaFin = moment();
                this.createForm();
            }
        });
    }

    load(): void {
        this.eventosService.findOne(this.id).subscribe(response => {
            this.evento = response.body;
		console.log(this.evento);
            this.createForm();
		          
        },
        err => {
            console.log(err);
        });
    }

    createForm(): void {
        this.eventoForm = this._fb.group({
            nombre: [this.evento.nombre, Validators.required],
            descripcion: [this.evento.descripcion, Validators.required],
            prefijo: [this.evento.prefijo, Validators.required],
            fechaInicio: [this.evento.fechaInicio, Validators.required],
            fechaFin: [this.evento.fechaFin, Validators.required],

		base64Portada: [null],
            fotoPortadaContentType: [null],
            fotoPortadaNombre: [null],
            fotos: this._fb.array([])
        });
    }

    handleFile(event: any): void {
        const file = <File>event.target.files[0];
        FilesUtils.readFileBynaryString(file).subscribe(data => {
            this.eventoForm.get('base64Portada').setValue(data.base64);
            this.eventoForm.get('fotoPortadaContentType').setValue(file.type);
            this.eventoForm.get('fotoPortadaNombre').setValue(file.name);

			this.fotoPortada = { base64: data.base64, contentType: data.type };
        });
    }

 sanitizeImagen(imagen: any): any {
        return this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + imagen.contentType + ';base64,' + imagen.base64);
    }
    addFoto(item: any): void {
        const fotos = <FormArray>this.eventoForm.controls['fotos'];
        fotos.push(this.initFoto(item));
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

    isEdit(): boolean {
        return this.evento.id ? true : false;
    }

onSubmit(): void {
    const params = this.eventoForm.value;
    if (this.isEdit() && this.id) { // Asegúrate de que estás editando un evento existente y que el ID está presente
        this.eventosService.edit(this.id, params).subscribe(response => {
            this.toastService.success('Evento editado correctamente');
            this.router.navigate(['/page/eventos']);
        },
        err => {
            console.log(err);
        });
    } else {
        this.eventosService.save(params).subscribe(response => {
            this.toastService.success('Evento creado correctamente');
            this.router.navigate(['/page/eventos']);
        },
        err => {
            console.log(err);
        });
    }
}

}
