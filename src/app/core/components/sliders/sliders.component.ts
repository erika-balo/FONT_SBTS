import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { SlidersService, ToastService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, currentUser } from 'app/store';

import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

@Component({
    selector: 'app-sliders',
    templateUrl: './sliders.component.html',
    styleUrls: ['./sliders.component.css']
})
export class SlidersComponent implements OnInit, OnDestroy {

    sliders: any[];

    user: any;
    isAdmin: boolean;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fb: FormBuilder,
        private slidersService: SlidersService,
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
		this.slidersService.findAll().subscribe(response => {
			this.sliders = response.body;
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