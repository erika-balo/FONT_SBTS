import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UsersDevolucionesService, ToastService } from 'app/services';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-users-devoluciones',
    templateUrl: './users-devoluciones.component.html',
    styleUrls: ['./users-devoluciones.component.css']
})
export class UsersDevolucionesComponent implements OnInit {

    userId: number;

    usersDevoluciones: any[];

    page: number;
    pageSize: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        private usersDevolucionesService: UsersDevolucionesService,
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
        this.usersDevolucionesService.getAllByUser(this.userId).subscribe(response => {
            this.usersDevoluciones = response.body;
        },
        err => {
            console.log(err);
        });
    }

}