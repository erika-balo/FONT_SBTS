import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {Pipe, PipeTransform} from '@angular/core';
import { LotesService, SubastasDetallesService, SubastasService } from 'app/services';

import * as _ from 'lodash';

import { environment } from 'app/../environments/environment';

@Pipe({
	name: 'safe'
})
export class UrlSeguraComponent {
	constructor(private sanitizer: DomSanitizer){}
	transForm(url){
		return  this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

}
