import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import { AppState, Logout, currentUser } from 'app/store';

import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

import { LotesService, ToastService, ConfigGeneralesService } from 'app/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	@Input() navClass: string;

	user: any;
	linkCatalogo: string;
	linkTutoriales: string;

	private _unsubscribeAll: Subject<any>;

	busquedaForm: FormGroup;

  constructor(
        private _fb: FormBuilder,
		private router: Router,
		private store: Store<AppState>,
		private toastService: ToastService,
		private lotesService: LotesService,
		private configGeneralesService: ConfigGeneralesService
	) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
      }
    });
  }

  isCondensed = false;


  ngAfterViewInit() {
    this._activateMenuDropdown();
  }

  ngOnInit(): void {
	this.loadConfigs();
	this._unsubscribeAll = new Subject();
	this.store.pipe(
		takeUntil(this._unsubscribeAll),
		select(currentUser),
		filter(user => user)
	).subscribe(user => {
		this.user = user;
	});

        this.busquedaForm = this._fb.group({
            numero: [null, Validators.required],
        });
  }

  loadConfigs(): void {
	  this.configGeneralesService.getAll().subscribe(response => {
		  const data = response.body;
		  data.forEach(dt => {
			  if (dt.slug === 'LINK_CATALOGO') {
				this.linkCatalogo = dt.valor;
			  }
			  if (dt.slug === 'LINK_TUTORIALES') {
				this.linkTutoriales = dt.valor;
			  }
		  });
	  },
	  err => {
		  console.log(err);
	  });
  }

  busqueda(): void {
	  const numero = this.busquedaForm['controls'].numero.value;
	  this.lotesService.byNumero(numero).subscribe(response => {
		const data = response.body;
		if (data.id) {
			this.router.navigate(['/lotes/ver-landing', data.id]);
		} else {
			this.toastService.error('No se encuentra ningún lote con ese número');
		}
	  },
	  err => {
		console.log(err);
	  });
  }

  _activateMenuDropdown() {
    /**
     * Menu activation reset
     */
    const resetParent = (el) => {
      el.classList.remove('active');
      const parent = el.parentElement;

      /**
       * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
       * We should come up with non hard coded approach
       */
      if (parent) {
        parent.classList.remove('active');
        const parent2 = parent.parentElement;
        if (parent2) {
          parent2.classList.remove('active');
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove('active');
            const parent4 = parent3.parentElement;
            if (parent4) {
              const parent5 = parent4.parentElement;
              parent5.classList.remove('active');
            }
          }
        }
      }
    };
    let links = document.getElementsByClassName('nav-link-ref');
    let matchingMenuItem = null;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < links.length; i++) {
      // reset menu
      resetParent(links[i]);
    }
    for (let i = 0; i < links.length; i++) {
      if (window.location.pathname === links[i]['pathname']) {
        matchingMenuItem = links[i];
        break;
      }
    }

    if (matchingMenuItem) {
      matchingMenuItem.classList.add('active');
      const parent = matchingMenuItem.parentElement;

      /**
       * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
       * We should come up with non hard coded approach
       */
      if (parent) {
        parent.classList.add('active');
        const parent2 = parent.parentElement;
        if (parent2) {
          parent2.classList.add('active');
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.add('active');
            const parent4 = parent3.parentElement;
            if (parent4) {
              const parent5 = parent4.parentElement;
              parent5.classList.add('active');
            }
          }
        }
      }
    }
  }

  /**
   * Window scroll method
   */
  // tslint:disable-next-line: typedef
  windowScroll() {
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      document.getElementById('topnav').classList.add('nav-sticky');
    } else {
      document.getElementById('topnav').classList.remove('nav-sticky');
    }
    if (document.getElementById('back-to-top')) {
      if (document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100) {
        document.getElementById('back-to-top').style.display = 'inline';
      } else {
        document.getElementById('back-to-top').style.display = 'none';
      }
    }
  }
  /**
   * Toggle menu
   */
  toggleMenu() {
    this.isCondensed = !this.isCondensed;
    if (this.isCondensed) {
      document.getElementById('navigation').style.display = 'block';
    } else {
      document.getElementById('navigation').style.display = 'none';
    }
  }

  /**
   * Menu clicked show the submenu
   */
  onMenuClick(event) {
    event.preventDefault();
    const nextEl = event.target.nextSibling.nextSibling;
    if (nextEl && !nextEl.classList.contains('open')) {
      const parentEl = event.target.parentNode;
      if (parentEl) {
        parentEl.classList.remove('open');
      }
      nextEl.classList.add('open');
    } else if (nextEl) {
      nextEl.classList.remove('open');
    }
    return false;
  };

    cerrarSesion(): void {
		this.store.dispatch(new Logout());
		this.user = null;
        this.router.navigate(['/']);
    }
}
