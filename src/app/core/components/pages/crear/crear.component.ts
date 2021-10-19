import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { FilesUtils } from 'app/shared/utils/files-utils';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { ToastService, PagesService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, currentUser } from 'app/store';

import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'


@Component({
    selector: 'app-pages-crear',
    templateUrl: './crear.component.html',
    styleUrls: ['./crear.component.css']
})
export class PagesCrearComponent implements OnInit, OnDestroy {

    id: number;

    pageForm: FormGroup;

    page: any;

    isAdmin: boolean;
	isUser: boolean;

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

    private _unsubscribeAll: Subject<any>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _fb: FormBuilder,
        private store: Store<AppState>,
        private pagesService: PagesService,
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
                this.page = {};
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
        this.pagesService.findOneCompleto(this.id).subscribe(response => {
			this.page = response.body;
            this.createForm();
        },
        err => {
            console.log(err);
        });
    }

    createForm(): void {
        this.pageForm = this._fb.group({
            urlRedireccion: [this.page.urlRedireccion],
            valor: [this.page.orden],
        });
	}

    isEdit(): boolean {
        return this.page.id ? true : false;
	}

    onSubmit(): void {
        if (!this.pageForm.valid) {
            return;
        }

		const params = this.pageForm.value;
		console.log(params);
        if (this.isEdit()) {
            this.pagesService.edit(this.id, params).subscribe(response => {
                this.toastService.success('Page editado correctamente');
                this.router.navigate(['/page/pages']);
            },
            err => {
                console.log(err);
            });
        } else {
			this.pagesService.save(params).subscribe(response => {
				this.toastService.success('Page creado correctamente');
				this.router.navigate(['/page/pages']);
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