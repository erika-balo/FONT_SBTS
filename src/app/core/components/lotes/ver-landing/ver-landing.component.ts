import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FilesUtils } from 'app/shared/utils/files-utils';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LotesService, ToastService, SubastasService } from 'app/services';
import { ConfirmacionComponent } from 'app/core/components/generales/confirmacion/confirmacion.component';
import { environment } from 'app/../environments/environment';

import * as _ from 'lodash';

@Component({
    selector: 'app-ver-lote-landing',
    templateUrl: './ver-landing.component.html',
    styleUrls: ['./ver-landing.component.css']
})
export class VerLoteLandingComponent implements OnInit {

	resourceUrl = environment.URL_IMAGENES;

    loteId: number;
	lote: any;
	lastSubasta: any;
	NoLote: any;	
	subasta: any;	
	Noevento: any;

	viewerOpenPortada: boolean;
	viewerOpen: boolean[];
    
    constructor(
        private activatedRoute: ActivatedRoute,
		private lotesService: LotesService,
		private modalService: NgbModal,
		private subastasService: SubastasService,
        	private domSanitizer: DomSanitizer,
		private toastService: ToastService,
		private router: Router
    ) {
    }

    ngOnInit(): void {
		this.viewerOpen = [];
        this.activatedRoute.params.subscribe(params => {
			this.loteId = +params['loteId'];
			this.load();
		});
	}

	load(): void {
		this.lotesService.findOneCompleto(this.loteId).subscribe(response => {
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
            if (subasta.estatus === 'EN_PISTA' || subasta.estatus === 'ABIERTO') {
                res = true;
                return;
            }
        });

        return res;
    }

    pujaAqui(): void {
        let ob: any = {};
        this.lote.subastas.forEach(subasta => {
            if (subasta.estatus === 'EN_PISTA' || subasta.estatus === 'ABIERTO') {
                ob = subasta;
                return;
            }
        });

        this.router.navigate(['/subastas/en-pista', ob.id]);
    }
	
	/*inicio pruebas*/
	  reAqui(): void {
                this.subastasService.getEnPista().subscribe(response => {
                        const data = response.body;
                        if (data === null) {
                              const modalRef = this.modalService.open(ConfirmacionComponent);
                        modalRef.componentInstance.texto = 'En este momento no se encuentra un lote en pista';
                        }else{
                                this.router.navigate(['/lotes/page-contact-detail/']);
                        }
                },
                err => {
                        console.log(err);
                });
        }
	
	pla(): boolean{
                return this.subasta && (this.subasta.estatus === 'VENDIDA');
        }
	/*fin pruebas*/

 
  navegarSiguiente(): void {
  const numeroLote = this.lote.numero;
  const subastaIdP = this.lote.subastas[0].id;
  const Noevento = this.lote.subastas.id;
  const numeroSuma = parseInt(numeroLote) + 1;
  this.subastasService.findOneCompleto(subastaIdP).subscribe(response => {
    const data = response.body;
   	this.Noevento = data.evento.id;
    },
    err => {
    console.log(err);
    });
  const numeroString = numeroSuma.toString();
    this.lotesService.findAllActivosBotones().subscribe(response => {
    const datas = response.body;
    let resultado = null;
    for (let i of  datas) {
    if( i.numero === numeroString && i.subastas[0].evento.id === this.Noevento){
        resultado = i.subastas[0].id;
    break
    }
    }
    if (resultado !== null) {
          this.router.navigate(['/subastas/en-pista/', resultado]);
    } else {
          const modalRef = this.modalService.open(ConfirmacionComponent);
                        modalRef.componentInstance.texto = 'No hay más lotes en este evento';
    }
    },
  err => {
  console.log(err);
  });
  
  }

navegarAnterior(): void {
  const numeroLote = this.lote.numero;
  const subastaIdP = this.lote.subastas[0].id;
  const numeroSuma = parseInt(numeroLote) - 1;
  this.subastasService.findOneCompleto(subastaIdP).subscribe(response => {
    const data = response.body;
    this.Noevento = data.evento.id;
    },
    err => {
    console.log(err);
    });
  const numeroString = numeroSuma.toString();
    this.lotesService.findAllActivosBotones().subscribe(response => {
    const datas = response.body;
    let resultado = null;
    for (let i of  datas) {
    if( i.numero === numeroString && i.subastas[0].evento.id === this.Noevento){
        resultado = i.subastas[0].id;
    break
    }
    }
    if (resultado !== null) {
          this.router.navigate(['/subastas/en-pista/', resultado]);
    } else {
          const modalRef = this.modalService.open(ConfirmacionComponent);
          modalRef.componentInstance.texto = 'No hay más lotes en este evento';
    }
    },
  err => {
  console.log(err);
  });
  
  }  


}
