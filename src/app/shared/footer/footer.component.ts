import { Component, OnInit } from '@angular/core';

import { ToastService, ConfigGeneralesService, PagesService } from 'app/services';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

	linkCatalogo: string;
	linkTutoriales: string;
	linkRegistrate: string;

	linkVideos: string;
	linkTerminos: string;
	linkEnSubasta: string;

	linkFacebook: string;
	linkInstagram: string;

	nombreEnlaceEnSubasta: string;
	nombreEnlaceEventosAnteriores: string;
	nombreEnlaceEventosFuturos: string;
	nombreEnlaceRegistrate: string;
	nombreEnlaceCatalogo: string;
	nombreEnlaceVideos: string;
	nombreEnlaceTerminosCondiciones: string;

	constructor(
		private configGeneralesService: ConfigGeneralesService,
		private pagesService: PagesService
	) {
	}

	ngOnInit(): void {
		this.loadConfigs();
	}

	loadConfigs(): void {
		this.configGeneralesService.getAll().subscribe(response => {
			const data = response.body;
			data.forEach(dt => {
				if (dt.slug === 'LINK_CATALOGO') {
					this.linkCatalogo = dt.valor;
				}
				if (dt.slug === 'LINK_EN_SUBASTA') {
					this.linkEnSubasta = dt.valor;
				}
				if (dt.slug === 'LINK_REGISTRATE') {
					this.linkRegistrate = dt.valor;
				}
				if (dt.slug === 'ICONO_FACEBOOK') {
					this.linkFacebook = dt.valor;
				}
				if (dt.slug === 'ICONO_INSTAGRAM') {
					this.linkInstagram = dt.valor;
				}
				if (dt.slug === 'ENLACE_EN_SUBASTA') {
					this.nombreEnlaceEnSubasta = dt.valor;
				}
				if (dt.slug === 'ENLACE_EVENTOS_ANTERIORES') {
					this.nombreEnlaceEventosAnteriores = dt.valor;
				}
				if (dt.slug === 'ENLACE_EVENTOS_FUTUROS') {
					this.nombreEnlaceEventosFuturos = dt.valor;
				}
				if (dt.slug === 'ENLACE_REGISTRATE') {
					this.nombreEnlaceRegistrate = dt.valor;
				}
				if (dt.slug === 'ENLACE_CATALOGO') {
					this.nombreEnlaceCatalogo = dt.valor;
				}
				if (dt.slug === 'ENLACE_VIDEOS') {
					this.nombreEnlaceVideos = dt.valor;
				}
				if (dt.slug === 'ENLACE_TERMINOS_CONDICIONES') {
					this.nombreEnlaceTerminosCondiciones = dt.valor;
				}
			});
		},
		err => {
			console.log(err);
		});
	}

	loadTutoriales(): void {
		this.pagesService.findAll().subscribe(response => {
			const data = response.body;
			data.forEach(dat => {
				if (data.slug === 'VIDEOS') {
					this.linkVideos = data.valor;
				}
				if (data.slug === 'TERMINOS_CONDICIONES') {
					this.linkTerminos = data.valor;
				}
			});
		},
		err => {
			console.log(err);
		});
	}

}