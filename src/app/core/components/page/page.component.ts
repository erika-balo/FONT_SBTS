import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagesService } from 'app/services';

@Component({
	selector: 'page',
	templateUrl: 'page.component.html'
})
export class PageComponent implements OnInit {

	slug: string;
	page: any;

	constructor(
		private pagesService: PagesService,
		private activatedRoute: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			this.slug = params.slug;
			this.load();
		},
		err => {
			console.log(err);
		});
	}

	load(): void {
		this.pagesService.findOneCompletoBySlug(this.slug).subscribe(response => {
			this.page = response.body;
		},
		err => {
			console.log(err);
		});
	}

}