import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GanadoraComponent } from '../ganadora/ganadora.component';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SubastasService, SubastasDetallesService } from 'app/services';

import { environment } from 'app/../environments/environment';

@Component({
    selector: 'app-subasta-ver',
    templateUrl: './ver.component.html',
    styleUrls: ['./ver.component.css']
})
export class SubastasVerComponent implements OnInit {

    id: number;

	topicSubasta: string;

	subasta: any;
	subastasDetalles: any[];

    constructor(
        private activatedRoute: ActivatedRoute,
		private subastasService: SubastasService,
		private subastasDetallesService: SubastasDetallesService,
		private chdr: ChangeDetectorRef,
		private modalService: NgbModal
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
			this.id = +params['id'];
			this.load();

			this.topicSubasta = 'topic-subasta-' + this.id;

			const url = new URL(environment.MERCURE_URL);
			url.searchParams.append('topic', this.topicSubasta);

			const eventSource = new EventSource(url.toString());
			eventSource.onmessage = e => {
				const data = JSON.parse(e.data);
				if (data.accion === 'puja') {
					this.loadDetalles();
				}
			};
		});
	}

	load(): void {
		this.subastasService.findOneCompleto(this.id).subscribe(response => {
			this.subasta = response.body;
			this.loadDetalles();
		},
		err => {
			console.log(err);
		});
	}

	loadDetalles(): void {
		this.subastasDetallesService.getDetallesBySubasta(this.id).subscribe(response => {
			this.subastasDetalles = response.body;
			this.chdr.detectChanges();
		},
		err => {
			console.log(err);
		});
	}

	openGanadora(item: any): void {
		const modalRef = this.modalService.open(GanadoraComponent);
		modalRef.componentInstance.id = item.id;
		modalRef.result.then(result => {
			this.loadDetalles();
		});
	}

	vendida(): void {
		this.subastasService.vendida(this.id).subscribe(response => {
			this.load();
		},
		err => {
			console.log(err);
		});
	}

}