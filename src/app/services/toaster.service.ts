import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
	toasts: any[] = [];

	show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
		this.toasts.push({ textOrTpl, ...options });
	}

	success(textOrTpl: string | TemplateRef<any>, options: any = {}) {
		const defaultOptions = {
			classname: 'bg-success text-light',
			delay: 2500
		};
		const resOptions = {...defaultOptions, ...options};
		this.toasts.push({ textOrTpl, ...resOptions });
	}

	error(textOrTpl: string | TemplateRef<any>, options: any = {}) {
		const defaultOptions = {
			classname: 'bg-danger text-light',
			delay: 2500
		};
		const resOptions = {...defaultOptions, ...options};
		this.toasts.push({ textOrTpl, ...resOptions });
	}

	remove(toast) {
		this.toasts = this.toasts.filter(t => t !== toast);
	}

}