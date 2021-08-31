import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FilesUtils } from 'app/shared/utils/files-utils';

import { RanchosService } from 'app/services';

@Component({
    selector: 'app-ver-rancho',
    templateUrl: './ver.component.html',
    styleUrls: ['./ver.component.css']
})
export class VerRanchoComponent implements OnInit {

    id: number;

	rancho: any;

    zoom: number;
    latitud: number;
    longitud: number;
    
    constructor(
        private activatedRoute: ActivatedRoute,
		private ranchosService: RanchosService,
        private domSanitizer: DomSanitizer,
		private router: Router
    ) {
    }

    ngOnInit(): void {
		this.zoom = 15;
        this.activatedRoute.params.subscribe(params => {
			this.id = +params['id'];
			this.load();
		});
	}

	load(): void {
		this.ranchosService.findOneCompleto(this.id).subscribe(response => {
			this.rancho = response.body;

            this.longitud = this.rancho.ubicacion.coordinates[0];
            this.latitud = this.rancho.ubicacion.coordinates[1];
		},
		err => {
			console.log(err);
		});
	}
	
}