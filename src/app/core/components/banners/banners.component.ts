import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { BannersService, ToastService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, currentUser } from 'app/store';

import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

@Component({
    selector: 'app-banners',
    templateUrl: './banners.component.html',
    styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit, OnDestroy {

    banners: any[];

    user: any;
    isAdmin: boolean;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fb: UntypedFormBuilder,
        private bannersService: BannersService,
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
		this.bannersService.findAll().subscribe(response => {
			this.banners = response.body;
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