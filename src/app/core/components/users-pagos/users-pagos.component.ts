import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UsersPagosService, ToastService } from 'app/services';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-users-pagos',
    templateUrl: './users-pagos.component.html',
    styleUrls: ['./users-pagos.component.css']
})
export class UsersPagosComponent implements OnInit {

    userId: number;

    usersPagos: any[];

    page: number;
    pageSize: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        private usersPagosService: UsersPagosService,
		private toastService: ToastService,
		private modalService: NgbModal
    ) {
    }

    ngOnInit(): void {
        this.page = 1;
        this.pageSize = 10;

        this.activatedRoute.params.subscribe(params => {
            this.userId = params.userId;
            this.load();
        });
    }

    load(): void {
        this.usersPagosService.getAllByUser(this.userId).subscribe(response => {
            this.usersPagos = response.body;
        },
        err => {
            console.log(err);
        });
    }

}