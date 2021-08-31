import { HttpParams } from '@angular/common/http';

export const createRequestOptionTotal = (req?: any[]): HttpParams => {
	let options: HttpParams = new HttpParams();
	if (req) {
		Object.keys(req).forEach(key => {
			if (key) {
				let val = req[key];
				if (val && val.value) {
					val = val.value;
				}
				options = options.set(key, val);
			}
		});
	}
    return options;
}

export const createRequestOptionPaginate = (page: number, limit: number, req?: any[]): HttpParams => {
	let options: HttpParams = new HttpParams();
	if (req) {
		Object.keys(req).forEach(key => {
			if (key) {
				let val = req[key];
				if (val && val.value) {
					val = val.value;
				}
				options = options.set(key, val);
			}
		});
	}
    options = options.set('page', page.toString());
    options = options.set('limit', limit.toString());
    return options;
}