import { ToolService } from './tools.service';
import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';



@Injectable()
export class ItemService {
    constructor(private http:HttpClient, private _tool : ToolService) {}

    // getItems(filterObject):  Observable<any> {

    //     filterObject = this._tool.getDefaultValuesForFilterObject(filterObject);
    //     return this.http.get(environment.baseApiLink + 'Items/GetItems', {
    //         params: filterObject
    //     });
	// }
    getItems(searched_item){

        return this.http.get(environment.baseApiLink + 'Items/GetItems',{
			        params: searched_item
			    });
	}
    getItem(id) {

        return this.http.get(`${environment.baseApiLink}Items/${id}/GetItem`);
	}

	updateItem(item ){
		return this.http.post(`${environment.baseApiLink}Items/UpdateItem` , item );
	}

    addItems(item){
        return this.http.post(environment.baseApiLink + 'Items/AddItem', item );
	}

    deleteItem(itemToBeDeleted){
        return this.http.post(environment.baseApiLink + 'Items/deleteItem', itemToBeDeleted );
    }

	restoreItem(itemToBeRestored){
		return this.http.post(environment.baseApiLink + 'Items/restoreItem', itemToBeRestored );
	}

}

