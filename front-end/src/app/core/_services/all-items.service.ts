import { ToolService } from './tools.service';
import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AllItemsService {

  constructor(private http:HttpClient) { }

	getItems(searched_items) {
		return this.http.get(environment.baseApiLink + 'Items/GetSpecItems',{
			params : searched_items
		});
	}

	getItemsOnEnter(searched_items) {
		return this.http.get(environment.baseApiLink + 'Items/GetItemsOnEnter',{
			params : searched_items
		});
	}
}
