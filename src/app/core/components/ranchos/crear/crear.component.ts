import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ToastService, RanchosService, UsersService } from 'app/services';

import { Store, select } from '@ngrx/store';
import { AppState, currentUser } from 'app/store';

import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators'

import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

@Component({
    selector: 'app-ranchos-crear',
    templateUrl: './crear.component.html',
    styleUrls: ['./crear.component.css']
})
export class RanchosCrearComponent implements OnInit, OnDestroy,AfterViewInit {

    @ViewChild('domicilioInput', { static: false })
    searchOrigenElementRef: ElementRef;

    zoom: number;

    id: number;

    ranchoForm: FormGroup;

    rancho: any;

    users: any[];
    user: any;

    isAdmin: boolean;
    isUser: boolean;

    latitud: number;
    longitud: number;
    direccion: string;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _fb: FormBuilder,
        private store: Store<AppState>,
        private ranchosService: RanchosService,
        private usersService: UsersService,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private toastService: ToastService
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.id = +params['id'];
                this.load();
            } else {
                this.rancho = {};
                this.rancho.user = {};
                this.createForm();
                this.loadMap();
            }
        });

        this._unsubscribeAll = new Subject();

        this.store.pipe(
            takeUntil(this._unsubscribeAll),
            select(currentUser),
            filter(user => user)
        ).subscribe(user => {
            this.user = user;
            this.isAdmin = user.roles.indexOf('ROLE_ADMIN') >= 0;
            this.isUser = user.roles.indexOf('ROLE_USER') >= 0;
            if (this.isAdmin) {
                this.loadUsers();
            }
        });
    }

    ngAfterViewInit() {
        if (!this.id) {
            this.setCurrentPosition();
        }
    }

    loadUsers(): void {
        this.usersService.getAllUsersTotal().subscribe(response => {
            this.users = response.body;
        },
        err => {
            console.log(err);
        });
    }

    load(): void {
        this.ranchosService.findOneCompleto(this.id).subscribe(response => {
            this.rancho = response.body;
            this.createForm();
            this.loadMap();

            this.longitud = this.rancho.ubicacion.coordinates[0];
            this.latitud = this.rancho.ubicacion.coordinates[1];

            this.zoom = 15;
        },
        err => {
            console.log(err);
        });
    }

    loadMap() {
        this.mapsAPILoader.load().then(() => {
            let autocompleteOrigen = new google.maps.places.Autocomplete(this.searchOrigenElementRef.nativeElement, {
                types: ['address']
            });
            autocompleteOrigen.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocompleteOrigen.getPlace();
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    this.latitud = place.geometry.location.lat();
                    this.longitud = place.geometry.location.lng();
                    this.direccion = place.formatted_address;
                    this.zoom = 15;
                });
            });
        });
    }

    setCurrentPosition() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitud = position.coords.latitude;
                this.longitud = position.coords.longitude;

                this.zoom = 15;
            });
        }
    }

    createForm(): void {
        this.ranchoForm = this._fb.group({
            direccion: [this.rancho.direccion],
            nombre: [this.rancho.nombre, Validators.required],
            numeroHato: [this.rancho.numeroHato, Validators.required],
            antenombre: [this.rancho.antenombre, Validators.required],
            titular: [this.rancho.titular, Validators.required],
            telefonoContacto: [this.rancho.telefonoContacto, Validators.required],
            email: [this.rancho.email, Validators.required],
            facebook: [this.rancho.facebook, Validators.required],
            instagram: [this.rancho.instagram, Validators.required],
            user: [this.rancho.user.id],
        });
    }

    isEdit(): boolean {
        return this.rancho.id ? true : false;
    }

    onSubmit(): void {
        if (!this.ranchoForm.valid) {
            return;
        }

        const params = this.ranchoForm.value;
        params.direccion = this.direccion;
        params.ubicacion = {
            type: 'point',
            coordinates: [this.longitud, this.latitud]
        };
        if (this.isEdit()) {
            this.ranchosService.edit(this.id, params).subscribe(response => {
                this.toastService.success('Rancho editado correctamente');
                this.router.navigate(['/page/ranchos']);
            },
            err => {
                console.log(err);
            });
        } else {
            if (this.user.roles.indexOf('ROLE_ADMIN') >= 0) {
                this.ranchosService.save(params).subscribe(response => {
                    this.toastService.success('Rancho creado correctamente');
                    this.router.navigate(['/page/ranchos']);
                },
                err => {
                    console.log(err);
                });
            } else {
                this.ranchosService.saveCurrent(params).subscribe(response => {
                    this.toastService.success('Rancho creado correctamente');
                    this.router.navigate(['/page/ranchos']);
                },
                err => {
                    console.log(err);
                });
            }
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}