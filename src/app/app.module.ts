import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CountToModule } from 'angular-count-to';
import { NgxMasonryModule } from 'ngx-masonry';
import { ScrollspyDirective } from './shared/scrollspy.directive'

import { MasterPageComponent } from './core/components/master-page/master-page.component';
import { AuthLoginComponent } from './auth/auth-login/auth-login.component';
import { AuthRePasswordComponent } from './auth/auth-re-password/auth-re-password.component';
import { AuthSignupComponent } from './auth/auth-signup/auth-signup.component';
import { EmailAlertComponent } from './email/email-alert/email-alert.component';
import { EmailConfirmationComponent } from './email/email-confirmation/email-confirmation.component';
import { EmailInvoiceComponent } from './email/email-invoice/email-invoice.component';
import { EmailPasswordResetComponent } from './email/email-password-reset/email-password-reset.component';
import { IndexComponent } from './core/components/index/index.component';
import { FeatherModule } from 'angular-feather';
import { NgxFileDropModule } from 'ngx-file-drop';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { metaReducers, reducers } from './store';

import { AuthEffects, authReducer } from 'app/store';

import { 
    ConfigDocumentosRegistroService,
    ConfigFormRegistroService,
    UsersService,
    AuthService,
    RanchosService,
    EventosService,
    LotesService,
    SubastasService,
    SubastasDetallesService,
    ToastService,
    ConfigGeneralesService,
    UsersPagosService,
    UsersDevolucionesService,
    PaisesService,
	EstadosService,
	SlidersService,
	PagesService,
	BannersService
} from './services';

import { allIcons, User } from 'angular-feather/icons';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SwitcherComponent } from './shared/switcher/switcher.component';
import { NgbModule, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { LayoutPageComponent } from './core/components/layout-page/layout-page.component';
import { LayoutHeaderComponent } from './core/components/layout-page/header/layout-header.component';
import { LayoutFooterComponent } from './core/components/layout-page/footer/layout-footer.component';

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
import { GanadoraComponent } from './core/components/subastas/ganadora/ganadora.component';
import { UsersComponent } from './core/components/users/users.component';
import { UsersVerComponent } from './core/components/users/ver/ver.component';
import { VerLoteLandingComponent } from './core/components/lotes/ver-landing/ver-landing.component';
import { ConfiguracionesDocumentosComponent } from './core/components/configuraciones-documentos/configuraciones-documentos.component';
import { ConfiguracionesDocumentosCrearComponent } from './core/components/configuraciones-documentos/crear/crear.component';
import { ConfiguracionesFormRegistroComponent } from './core/components/configuraciones-form-registro/configuraciones-form-registro.component';
import { SubastasEnPistaSubastadorComponent } from './core/components/subastas/en-pista-subastador/en-pista-subastador.component';
import { CambioPasswordComponent } from './core/components/users/cambio-password/cambio-password.component';
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
import { CerrarSubastaComponent } from './core/components/subastas/cerrar/cerrar.component';
import { PageComponent } from './core/components/page/page.component';
import { SlidersComponent } from './core/components/sliders/sliders.component';
import { SlidersCrearComponent } from './core/components/sliders/crear/crear.component';
import { AuthRePasswordFinishComponent } from './auth/auth-re-password-finish/auth-re-password-finish.component';
import { PagesComponent } from './core/components/pages/pages.component';
import { PagesCrearComponent } from './core/components/pages/crear/crear.component';
import { BannersComponent } from './core/components/banners/banners.component';
import { BannersCrearComponent } from './core/components/banners/crear/crear.component';
import { HistorialEventosComponent } from './core/components/historial-eventos/historial-eventos.component';

import { ConfirmacionComponent } from './core/components/generales/confirmacion/confirmacion.component';

import { ToastsContainer } from './toaster-container';
import { ImageViewerComponent } from './core/components/subastas/image-viewer/image-viewer.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'app/core/interceptores/token.interceptor';

import { NgbDateMomentAdapter } from './moment-adapter';

import { AuthGuard } from './shared/guards/auth.guard';
import { RolesGuard } from './shared/guards/roles.guard';

import { AgmCoreModule } from '@agm/core';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        MasterPageComponent,
        AuthLoginComponent,
        AuthRePasswordComponent,
        AuthSignupComponent,
        EmailAlertComponent,
        EmailConfirmationComponent,
        EmailInvoiceComponent,
        EmailPasswordResetComponent,
        IndexComponent,
        SwitcherComponent,
        ScrollspyDirective,
        LayoutPageComponent,
        LayoutFooterComponent,
        LayoutHeaderComponent,
        DashboardComponent,
        RanchosComponent,
        RanchosCrearComponent,
        EventosComponent,
        EventosCrearComponent,
        LotesComponent,
        LotesCrearComponent,
        SubastasComponent,
        SubastasCrearComponent,
        SubastasEnPistaComponent,
        SubastasVerComponent,
        GanadoraComponent,
        UsersComponent,
        UsersVerComponent,
        ToastsContainer,
        ImageViewerComponent,
        ConfirmacionComponent,
        VerLoteLandingComponent,
        ConfiguracionesDocumentosComponent,
        ConfiguracionesDocumentosCrearComponent,
        ConfiguracionesFormRegistroComponent,
        SubastasEnPistaSubastadorComponent,
        CambioPasswordComponent,
        ConfiguracionesGeneralesComponent,
        UsersPagosComponent,
        UsersPagosCrearComponent,
        UsersDevolucionesComponent,
        UsersDevolucionCrearComponent,
        UsersEditarComponent,
        VerLoteComponent,
        VerRanchoComponent,
        VerEventoComponent,
        PageContactDetailComponent,
        SubastasVerPujasComponent,
        VerPujasComponent,
        TableroClienteComponent,
        UsersCrearComponent,
        CerrarSubastaComponent,
        PageComponent,
        SlidersComponent,
        SlidersCrearComponent,
        AuthRePasswordFinishComponent,
        PagesComponent,
        PagesCrearComponent,
        BannersComponent,
        BannersCrearComponent,
        HistorialEventosComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        RouterModule,
        CarouselModule,
        FeatherModule.pick(allIcons),
        ScrollToModule.forRoot(),
        RouterModule.forRoot([], { scrollPositionRestoration: 'enabled' }),
        NgxMaskModule.forRoot(),
        NgxYoutubePlayerModule,
        NgbModule,
        NgbNavModule,
        FormsModule,
        SwiperModule,
        NgxTypedJsModule,
        FlatpickrModule.forRoot(),
        CountToModule,
        NgxMasonryModule,
        NgxFileDropModule,
        AngularEditorModule,
        InfiniteScrollModule,
        StoreModule.forRoot(reducers, { metaReducers }),
        EffectsModule.forRoot([]),
        StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
        StoreDevtoolsModule.instrument(),
        StoreModule.forFeature('auth', authReducer),
        EffectsModule.forFeature([AuthEffects]),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBdIGiOIG2Gm5WsQrHsVpugpYwd0EovGuk',
            libraries: ['places']
        })
    ],
    exports: [
        FeatherModule,
        ScrollspyDirective
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: [
        {
            provide: SWIPER_CONFIG,
            useValue: DEFAULT_SWIPER_CONFIG
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: NgbDateAdapter,
            useClass: NgbDateMomentAdapter
        },
        ConfigDocumentosRegistroService,
        UsersService,
        AuthService,
        RanchosService,
        EventosService,
        LotesService,
        SubastasService,
        SubastasDetallesService,
        ToastService,
        AuthGuard,
        RolesGuard,
        ConfigFormRegistroService,
        ConfigGeneralesService,
        UsersPagosService,
        UsersDevolucionesService,
        PaisesService,
        EstadosService,
        SlidersService,
        PagesService,
        BannersService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
