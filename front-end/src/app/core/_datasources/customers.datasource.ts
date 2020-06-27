import { CustomerService } from './../_services/customer.service';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

export class CustomersDataSource implements DataSource<any> {

    private itemsSubject = new BehaviorSubject<any[]>([]);
    private maxCountSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private salarySubject = new BehaviorSubject<number>(0);

    // public loading$ = this.loadingSubject.asObservable();
    // public data$ = this.itemsSubject.asObservable();
    // public maxCount$ = this.maxCountSubject.asObservable();
    // public totalSalary$ = this.salarySubject.asObservable();

    constructor(private CustomerService: CustomerService) {}

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.maxCountSubject.complete();
    }

    // loadItems(filterObject) {
    //     this.loadingSubject.next(true);

    //     this.CustomerService.getCustomers().pipe(
    //         catchError(() => {
    //             this.maxCountSubject.next(0);
    //             this.salarySubject.next(0);
    //             return of([])
    //         } ),
    //         finalize(() => {
    //             this.loadingSubject.next(false)
    //         })
    //     )
    //     .subscribe(res => {
    //         this.maxCountSubject.next(res.maxCount);
    //         this.calcTotalSalary(res.customers);
    //         return this.itemsSubject.next(res.customers)
    //     });
    // }

    // calcTotalSalary(data){
    //     let totalSalary = 0;
    //     data.forEach(element => {
    //         totalSalary += parseFloat(element.salary) ;
    //     });

    //     this.salarySubject.next(totalSalary);
    // }
}
