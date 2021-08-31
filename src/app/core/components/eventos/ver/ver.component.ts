import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FilesUtils } from 'app/shared/utils/files-utils';

import { EventosService } from 'app/services';

@Component({
    selector: 'app-ver-evento',
    templateUrl: './ver.component.html',
})
export class VerEventoComponent implements OnInit {

    id: number;

	evento: any;

    constructor(
        private activatedRoute: ActivatedRoute,
		private eventosService: EventosService,
        private domSanitizer: DomSanitizer,
		private router: Router
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
			this.id = +params['id'];
			this.load();
		});
	}

	load(): void {
		this.eventosService.findOne(this.id).subscribe(response => {
			this.evento = response.body;
		},
		err => {
			console.log(err);
		});
	}
	
}