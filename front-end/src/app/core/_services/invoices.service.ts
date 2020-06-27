import { ToolService } from './tools.service';
import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class invoicesService {

  	constructor(private http:HttpClient) { }

  	getInvoices(searched_invoices) {
		return this.http.get(environment.baseApiLink + `Invoices/GetInvoices`,{
			params : searched_invoices
		});
	}

	getInvoice(id) {
		return this.http.get(environment.baseApiLink + `Invoices/${id}/GetInvoice`);
  	}

	getPrevInvoice(id) {
    	return this.http.get(environment.baseApiLink + `Invoices/${id}/GetPreviousInvoice`);
	}

	getNextInvoice(id) {
    	return this.http.get(environment.baseApiLink + `Invoices/${id}/GetNextInvoice`);
	}

	addInvoice(formData) {
		return this.http.post(environment.baseApiLink + `Invoices/AddInvoice`, formData);
	}

	updateInvoice(formData) {
		return this.http.post(environment.baseApiLink + `Invoices/UpdateInvoice`, formData);
	}

	printInvoice(printData){
		return this.http.post(environment.baseApiLink + `Invoices/PrintInvoice`, printData);
	}

}
