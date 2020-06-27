import { ToolService } from './tools.service';
import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';



@Injectable()
export class CustomerService {
    constructor(private http:HttpClient, private _tool : ToolService) {}

    // getCustomers(filterObject):  Observable<any> {

    //     filterObject = this._tool.getDefaultValuesForFilterObject(filterObject);
    //     return this.http.get(environment.baseApiLink + 'Customers/GetCustomers', {
    //         params: filterObject
    //     });
	// }
    getCustomers(searched_customer){
        return this.http.get(environment.baseApiLink + 'Customers/GetCustomers',{
			params:searched_customer
		});
	}

	getCustomer(id) {

        return this.http.get(`${environment.baseApiLink}Customers/${id}/GetCustomer`);
	}

	updateCustomer(id , customer ){
		return this.http.post(`${environment.baseApiLink}Customers/${id}/UpdateCustomer` , customer );
	}

    addCustomers(customer){
        return this.http.post(environment.baseApiLink + 'Customers/AddCustomer', customer );
	}

	payDebt(payed_data){
		return this.http.post(`${environment.baseApiLink}Customers/payDebt` , payed_data );
	}

}

