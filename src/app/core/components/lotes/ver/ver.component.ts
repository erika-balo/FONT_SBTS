import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FilesUtils } from 'app/shared/utils/files-utils';

import { LotesService } from 'app/services';

import { environment } from 'app/../environments/environment';

import * as _ from 'lodash';

@Component({
    selector: 'app-ver-lote',
    templateUrl: './ver.component.html',
    styleUrls: ['./ver.component.css']
})
export class VerLoteComponent implements OnInit {

	resourceUrl = environment.URL_IMAGENES;

    id: number;

	lote: any;
	lastSubasta: any;

	viewerOpenPortada: boolean;
	viewerOpen: boolean[];
    
    constructor(
        private activatedRoute: ActivatedRoute,
		private lotesService: LotesService,
        private domSanitizer: DomSanitizer,
		private router: Router
    ) {
    }

    ngOnInit(): void {
		this.viewerOpen = [];
        this.activatedRoute.params.subscribe(params => {
			this.id = +params['id'];
			this.load();
		});
	}

	load(): void {
		this.lotesService.findOneCompleto(this.id).subscribe(response => {
			this.lote = response.body;
			this.lastSubasta = this.lote.subastas && this.lote.subastas.length > 0 ? _.first(this.lote.subastas) : null;
			this.lote.lotesFotos.forEach(foto =>  {
				this.viewerOpen.push(false);
			});
		},
		err => {
			console.log(err);
		});
	}
	
	descargaPDF(): void {
		FilesUtils.downloaFile({ base64: this.lote.informacion, mimeType: this.lote.informacionContentType, info: { name: this.lote.informacionNombre } });
	}

    sanitizeImagen(imagen: any): any {
        return this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + imagen.contentType + ';base64,' + imagen.base64);
	}

	openVideo(): void {
		window.open(this.lote.linkYoutube, '_blank');
	}

	openPdf(): void {
		window.open(this.lote.linkPdf, '_blank');
	}

    checkIsInPista(): boolean {
        let res = false;

        this.lote.subastas.forEach(subasta => {
            if (subasta.estatus === 'EN_PISTA') {
                res = true;
                return;
            }
        });

        return res;
    }

}