import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './core/components/index/index.component';
import { MasterPageComponent } from './core/components/master-page/master-page.component';
import { SwitcherComponent } from './shared/switcher/switcher.component';
import { AuthSignupComponent } from './auth/auth-signup/auth-signup.component';
import { AuthLoginComponent } from './auth/auth-login/auth-login.component';

import { LayoutPageComponent } from './core/components/layout-page/layout-page.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { RanchosComponent } from './core/components/ranchos/ranchos.component';
import { RanchosCrearComponent } from './core/components/ranchos/crear/crear.component';
import { EventosComponent } from './core/components/eventos/eventos.component';
import { EventosCrearComponent } from './core/components/eventos/crear/crear.component';
import { LotesComponent } from './core/components/lotes/lotes.component';
import { LotesCrearComponent } from './core/components/lotes/crear/crear.component';
import { SubastasComponent } from './core/components/subastas/subastas.component';
import { SubastasCrearComponent } from './core/components/subastas/crear/crear.component';
import { SubastasEnPistaComponent } from './core/components/subastas/en-pista/en-pista.component';
import { SubastasVerComponent } from './core/components/subastas/ver/ver.component';
import { UsersComponent } from './core/components/users/users.component';
import { UsersVerComponent } from './core/components/users/ver/ver.component';
import { VerLoteLandingComponent } from './core/components/lotes/ver-landing/ver-landing.component';
import { ConfiguracionesDocumentosComponent } from './core/components/configuraciones-documentos/configuraciones-documentos.component';
import { ConfiguracionesDocumentosCrearComponent } from './core/components/configuraciones-documentos/crear/crear.component';
import { ConfiguracionesFormRegistroComponent } from './core/components/configuraciones-form-registro/configuraciones-form-registro.component';
import { SubastasEnPistaSubastadorComponent } from './core/components/subastas/en-pista-subastador/en-pista-subastador.component';
import { ConfiguracionesGeneralesComponent } from './core/components/configuraciones-generales/configuraciones-generales.component';
import { UsersPagosComponent } from './core/components/users-pagos/users-pagos.component';
import { UsersPagosCrearComponent } from './core/components/users-pagos/crear/crear.component';
import { UsersDevolucionesComponent } from './core/components/users-devoluciones/users-devoluciones.component';
import { UsersDevolucionCrearComponent } from './core/components/users-devoluciones/crear/crear.component';
import { UsersEditarComponent } from './core/components/users/editar/editar.component';
import { VerLoteComponent } from './core/components/lotes/ver/ver.component';
import { VerRanchoComponent } from './core/components/ranchos/ver/ver.component';
import { VerEventoComponent } from './core/components/eventos/ver/ver.component';
import { PageContactDetailComponent } from './core/components/lotes/page-contact-detail/page-contact-detail.component';
import { SubastasVerPujasComponent } from './core/components/subastas/pujas/pujas.component';
import { VerPujasComponent } from './core/components/pujas/pujas.component';
import { TableroClienteComponent } from './core/components/tablero-cliente/tablero-cliente.component';
import { UsersCrearComponent } from './core/components/users/crear/crear.component';
import { PageComponent } from './core/components/page/page.component';
import { SlidersComponent } from './core/components/sliders/sliders.component';
import { SlidersCrearComponent } from './core/components/sliders/crear/crear.component';
import { AuthRePasswordComponent } from './auth/auth-re-password/auth-re-password.component';
import { AuthRePasswordFinishComponent } from './auth/auth-re-password-finish/auth-re-password-finish.component';
import { PagesComponent } from './core/components/pages/pages.component';
import { PagesCrearComponent } from './core/components/pages/crear/crear.component';
import { BannersComponent } from './core/components/banners/banners.component';
import { BannersCrearComponent } from './core/components/banners/crear/crear.component';
import { HistorialEventosComponent } from './core/components/historial-eventos/historial-eventos.component';
import { UrlSeguraComponent } from './core/components/lotes/url/urlsegura';
import { AuthGuard } from './shared/guards/auth.guard';
import { RolesGuard } from './shared/guards/roles.guard';

const routes: Routes = [
  {
    path: '',
    component: MasterPageComponent,
    children: [
      { path: '', component: IndexComponent },
      { path: 'list', component: IndexComponent },
      { path: '#', component: SwitcherComponent },
      { path: 'lotes/ver-landing/:loteId', component: VerLoteLandingComponent },
      { path: 'subastas/en-pista/:subastaId', component: SubastasEnPistaComponent },
      { path: 'tablero', component: TableroClienteComponent },
      { path: 'enlace/:slug', component: PageComponent },
	{ path: 'lotes/page-contact-detail', component: PageContactDetailComponent },	
      { path: 'historial-eventos', component: HistorialEventosComponent },
    ]
  },  
  {
    path: 'page',
    component: LayoutPageComponent,
	canActivate: [AuthGuard, RolesGuard],
	data: {roles: ['ROLE_ADMIN', 'ROLE_SUBASTA']},
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'ranchos', component: RanchosComponent },
      { path: 'ranchos/crear', component: RanchosCrearComponent },
      { path: 'ranchos/editar/:id', component: RanchosCrearComponent },
      { path: 'ranchos/ver/:id', component: VerRanchoComponent },
      { path: 'eventos', component: EventosComponent },
      { path: 'eventos/crear', component: EventosCrearComponent },
      { path: 'eventos/editar/:id', component: EventosCrearComponent },
      { path: 'eventos/ver/:id', component: VerEventoComponent },
      { path: 'lotes', component: LotesComponent },
      { path: 'lotes/crear', component: LotesCrearComponent },
      { path: 'lotes/editar/:id', component: LotesCrearComponent },
      { path: 'lotes/ver/:id', component: VerLoteComponent },
      { path: 'subastas', component: SubastasComponent },
      { path: 'subastas/crear', component: SubastasCrearComponent },
      { path: 'subastas/editar/:id', component: SubastasCrearComponent },
      { path: 'subastas/ver/:id', component: SubastasVerComponent },
      { path: 'subastas/en-pista-subastador/:subastaId', component: SubastasEnPistaSubastadorComponent },
      { path: 'subastas/ver/pujas/:subastaId', component: SubastasVerPujasComponent },
      { path: 'users', component: UsersComponent },
      { path: 'users/ver/:id', component: UsersVerComponent },
      { path: 'users/editar/:id', component: UsersEditarComponent },
      { path: 'users/crear', component: UsersCrearComponent },
      { path: 'configuraciones-documentos', component: ConfiguracionesDocumentosComponent },
      { path: 'configuraciones-documentos/crear', component: ConfiguracionesDocumentosCrearComponent },
      { path: 'configuraciones-documentos/editar/:id', component: ConfiguracionesDocumentosCrearComponent },
      { path: 'configuraciones-form-registro', component: ConfiguracionesFormRegistroComponent },
      { path: 'configuraciones-generales', component: ConfiguracionesGeneralesComponent },
      { path: 'configuraciones-sliders', component: SlidersComponent },
      { path: 'configuraciones-sliders/crear', component: SlidersCrearComponent },
      { path: 'configuraciones-sliders/editar/:id', component: SlidersCrearComponent },
      { path: 'users-pagos/:userId', component: UsersPagosComponent },
      { path: 'users-pagos/crear/:userId', component: UsersPagosCrearComponent },
      { path: 'users-pagos/editar/:userId/:id', component: UsersPagosCrearComponent },
      { path: 'users-devoluciones/:userId', component: UsersDevolucionesComponent },
      { path: 'users-devoluciones/crear/:userId', component: UsersDevolucionCrearComponent },
      { path: 'users-devoluciones/editar/:userId/:id', component: UsersDevolucionCrearComponent },
      { path: 'pujas', component: VerPujasComponent },
      { path: 'pages', component: PagesComponent },
      { path: 'pages/editar/:id', component: PagesCrearComponent },
      { path: 'banners', component: BannersComponent },
      { path: 'banners/editar/:id', component: BannersCrearComponent },
	{ path: 'lotes/url/urlsegura', component: UrlSeguraComponent }
    ]
  },  
  {
    path: 'subastador',
    component: LayoutPageComponent,
	canActivate: [AuthGuard, RolesGuard],
	data: {roles: ['ROLE_SUBASTA']},
    children: [
      { path: 'subastas/en-pista-subastador/:subastaId', component: SubastasEnPistaSubastadorComponent },
    ]
  },  
  {
    path: 'user',
    component: LayoutPageComponent,
	canActivate: [AuthGuard],
    children: [
    //   { path: 'subastas/en-pista/:subastaId', component: SubastasEnPistaComponent },
    ]
  },  
  { path: 'auth-signup', component: AuthSignupComponent },
  { path: 'auth-login', component: AuthLoginComponent },
  { path: 'auth-re-password', component: AuthRePasswordComponent },
  { path: 'auth-re-password-finish/:token', component: AuthRePasswordFinishComponent },
  { path: 'lotes/page-contact-detail', component: PageContactDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
