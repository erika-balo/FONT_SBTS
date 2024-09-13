import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray } from '@angular/forms';

import { ToastService, ConfigDocumentosRegistroService } from 'app/services';

@Component({
    selector: 'app-config-documentos-crear',
    templateUrl: './crear.component.html',
    styleUrls: ['./crear.component.css']
})
export class ConfiguracionesDocumentosCrearComponent implements OnInit, OnDestroy {

    id: number;

    documentoForm: UntypedFormGroup;

    documento: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _fb: UntypedFormBuilder,
        private configDocumentosRegistrosService: ConfigDocumentosRegistroService,
        private toastService: ToastService
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.id = +params['id'];
                this.load();
            } else {
                this.documento = {};
                this.createForm();
            }
        });
    }

    load(): void {
        this.configDocumentosRegistrosService.findOne(this.id).subscribe(response => {
            this.documento = response.body;
            this.createForm();
        },
        err => {
            console.log(err);
        });
    }

    createForm(): void {
        this.documentoForm = this._fb.group({
            nombre: [this.documento.nombre, Validators.required],
            requerido: [this.documento.requerido ? true : false, Validators.required],
            activo: [this.documento.activo ? true : false, Validators.required],
        });
    }

    isEdit(): boolean {
        return this.documento.id ? true : false;
    }

    onSubmit(): void {
        const params = this.documentoForm.value;
        if (this.isEdit()) {
            this.configDocumentosRegistrosService.edit(this.id, params).subscribe(response => {
                this.toastService.success('Documento editado correctamente');
                this.router.navigate(['/page/configuraciones-documentos']);
            },
            err => {
                console.log(err);
            });
        } else {
            this.configDocumentosRegistrosService.save(params).subscribe(response => {
                this.toastService.success('Documento creado correctamente');
                this.router.navigate(['/page/configuraciones-documentos']);
            },
            err => {
                console.log(err);
            });
        }
    }

    ngOnDestroy(): void {
    }

}