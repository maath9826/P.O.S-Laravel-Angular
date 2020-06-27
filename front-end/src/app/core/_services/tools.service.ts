import { Injectable } from '@angular/core';




@Injectable()
export class ToolService {


    getDefaultValuesForFilterObject (filterObject) : any {

        if (!filterObject.hasOwnProperty('_page')) {
            filterObject['_page'] = 1;
        }
        else {
            if (!filterObject['_page'])
                filterObject['_page'] = 1;

        }

        if (!filterObject.hasOwnProperty('_limit')) {
            filterObject['_limit'] = 10;
        } else {
            if (!filterObject['_limit'])
                filterObject['_limit'] = 10;
        }

        if (filterObject.hasOwnProperty('_order')) {
            if (!filterObject['_order'])
                delete filterObject['_order'];
        }


        if (filterObject.hasOwnProperty('_sort')) {
            if (!filterObject['_sort'])
                delete filterObject['_sort'];
        }


        return filterObject;


    }

}

