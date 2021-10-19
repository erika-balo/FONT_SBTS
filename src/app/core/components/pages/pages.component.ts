import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { PagesService, ToastService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, currentUser } from 'app/store';

import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit, OnDestroy {

    pages: any[];

    user: any;
    isAdmin: boolean;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fb: FormBuilder,
        private pagesService: PagesService,
        private store: Store<AppState>,
		private toastService: ToastService,
    ) {
    }

    ngOnInit(): void {
        this._unsubscribeAll = new Subject();

        this.store.pipe(
            takeUntil(this._unsubscribeAll),
            select(currentUser),
            filter(user => user)
        ).subscribe(user => {
            this.user = user;
            this.isAdmin = user.roles.indexOf('ROLE_ADMIN') >= 0;
            this.load();
        });
    }

    load(): void {
		this.pagesService.findAll().subscribe(response => {
			this.pages = response.body;
		},
		err => {
			console.log(err);
		});
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}