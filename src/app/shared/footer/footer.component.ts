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

	linkVideos: string;
	linkTerminos: string;

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