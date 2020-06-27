import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  constructor(private http:HttpClient) { }

  getSpecificStatus(date){

	return this.http.get(environment.baseApiLink + 'status/specific', {
		params : date
	});
}
  getChartStatus(interval){

	return this.http.get(environment.baseApiLink + 'status/chart', {
		params : interval
	});
}
}
