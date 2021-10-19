import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { FilesUtils } from 'app/shared/utils/files-utils';

import { ToastService, BannersService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, currentUser } from 'app/store';

import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'


@Component({
    selector: 'app-banner-crear',
    templateUrl: './crear.component.html',
    styleUrls: ['./crear.component.css']
})
export class BannersCrearComponent implements OnInit, OnDestroy {

    id: number;

    bannerForm: FormGroup;

    banner: any;

    isAdmin: boolean;
	isUser: boolean;
	
	fotoImagen: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _fb: FormBuilder,
        private store: Store<AppState>,
        private bannersService: BannersService,
        private ngZone: NgZone,
        private domSanitizer: DomSanitizer,
        private toastService: ToastService
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.id = +params['id'];
                this.load();
            } else {
                this.banner = {};
                this.createForm();
            }
        });

        this._unsubscribeAll = new Subject();

        this.store.pipe(
            takeUntil(this._unsubscribeAll),
            select(currentUser),
            filter(user => user)
        ).subscribe(user => {
            this.isAdmin = user.roles.indexOf('ROLE_ADMIN') >= 0;
            this.isUser = user.roles.indexOf('ROLE_USER') >= 0;
        });
    }

    load(): void {
        this.bannersService.findOneCompleto(this.id).subscribe(response => {
			this.banner = response.body;
			console.log(this.banner);
            this.createForm();
        },
        err => {
            console.log(err);
        });
    }

    createForm(): void {
        this.bannerForm = this._fb.group({
            base64Imagen: [null],
            imagenContentType: [null],
            imagenNombre: [null],
        });
	}

    handleFile(event: any): void {
        const file = <File>event.target.files[0];
        FilesUtils.readFileBynaryString(file).subscribe(data => {
            this.bannerForm.get('base64Imagen').setValue(data.base64);
            this.bannerForm.get('imagenContentType').setValue(file.type);
            this.bannerForm.get('imagenNombre').setValue(file.name);

			this.fotoImagen = { base64: data.base64, contentType: data.type };
        });
    }

    isEdit(): boolean {
        return this.banner.id ? true : false;
	}

    sanitizeImagen(imagen: any): any {
        return this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + imagen.contentType + ';base64,' + imagen.base64);
    }

    onSubmit(): void {
        if (!this.bannerForm.valid) {
            return;
        }

		const params = this.bannerForm.value;
        if (this.isEdit()) {
            this.bannersService.edit(this.id, params).subscribe(response => {
                this.toastService.success('Banner editado correctamente');
                this.router.navigate(['/page/banners']);
            },
            err => {
                console.log(err);
            });
        } else {
			this.bannersService.save(params).subscribe(response => {
				this.toastService.success('Banner creado correctamente');
				this.router.navigate(['/page/banners']);
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