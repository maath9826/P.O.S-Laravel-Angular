import { ItemService } from './../_services/items.service';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material';

export class ItemsDataSource implements DataSource<any> {

    private itemsSubject = new BehaviorSubject<any[]>([]);
    private maxCountSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private salarySubject = new BehaviorSubject<number>(0);

    public loading$ = this.loadingSubject.asObservable();
    public data$ = this.itemsSubject.asObservable();
    public maxCount$ = this.maxCountSubject.asObservable();
    public totalSalary$ = this.salarySubject.asObservable();

	paginator: MatPaginator | null;
    private _paginator;
    constructor(private itemService: ItemService) {}

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.maxCountSubject.complete();
    }

    loadItems(filterObject) {
        this.loadingSubject.next(true);

		this.itemService.getItems({})
		.pipe(
            // catchError(() => {
            //     this.maxCountSubject.next(0);
            //     this.salarySubject.next(0);
            //     return of([])
            // } ),
            finalize(() => {
                this.loadingSubject.next(false)
            })
        )
        .subscribe(res => {
            // this.maxCountSubject.next(res.maxCount);
            // this.calcTotalSalary(res.items);
            return this.itemsSubject.next(res['items'])
        });
    }

    calcTotalSalary(data){
        let totalSalary = 0;
        data.forEach(element => {
            totalSalary += parseFloat(element.salary) ;
        });

        this.salarySubject.next(totalSalary);
    }
}
