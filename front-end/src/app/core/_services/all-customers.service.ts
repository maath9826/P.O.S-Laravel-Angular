import { ToolService } from './tools.service';
import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AllCustomersService {

  constructor(private http:HttpClient) { }

  getCustomers(searched_customers) {
	return this.http.get(environment.baseApiLink + 'Customers/GetSpecCustomers',{
		params:searched_customers
	});
}
}
