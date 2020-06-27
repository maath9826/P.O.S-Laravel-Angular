import { AddCustomersComponent } from './../add-customers/add-customers.component';
import { EditCustomersComponent } from './../edit-customers/edit-customers.component';
import { PayDebtComponent } from './../pay-debt/pay-debt.component';
import { CustomerService } from './../../../../core/_services/customer.service';
import { ItemService } from './../../../../core/_services/items.service';
import { CustomersDataSource } from '../../../../core/_datasources/customers.datasource';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { tap } from 'rxjs/internal/operators/tap';
import { FormControl } from '@angular/forms';
import { AddInvoiceComponent } from '../add-invoice/add-invoice.component';



@Component({
	selector: 'kt-view-customers',
	templateUrl: './view-customers.component.html',
	styleUrls: ['./view-customers.component.scss'],

})
export class ViewCustomersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'phone', 'credit','edit','addInvoice'];
//   dataSource : CustomersDataSource;
  dataSource ;
//   customer_id;
//   credit;
  tableCustomers = [];
  search_item_input = new FormControl
  ddd;
  selectedRadioOption:string = 'الكل';
  radioOptions = ['مع دين', 'الكل']
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public dialog: MatDialog,
	private _customerService: CustomerService,
	private _snackBar: MatSnackBar) { }

  ngOnInit() {

	// let n : any=19288;
	// let numberString = n.toString();
	// let x = numberString.length ;
	// x--
	// // n = n.join(numberString.length);


	//   console.log(x)
	// console.log(n.split())
	//   this.dataSource = new CustomersDataSource(this._customerService);
	// //   console.log(this.dataSource)
    this.loadCustomers();


  }

  loadCustomers(){
	if(!this.search_item_input.value){
		this._customerService.getCustomers({}).subscribe(res=>{
			this.tableCustomers = res['customers'];
			this.dataSource = new MatTableDataSource(this.tableCustomers);
			this.dataSource.paginator = this.paginator;
		  })
	  }else{
		this._customerService.getCustomers({search : this.search_item_input.value }).subscribe(res=>{
			this.tableCustomers = res['customers'];
			this.dataSource = new MatTableDataSource(this.tableCustomers);
			this.dataSource.paginator = this.paginator;
		  })
	  }

  }

//   loadItems(){
//     this.dataSource.loadItems({
//       _page: this.paginator.pageIndex + 1 || 1,
//       _limit: this.paginator.pageSize || 0,
//       _sort: this.sort.active,
//       _order: this.sort.direction,
// 	});

//   }

//   ngAfterViewInit() {
//     this.paginator.page
//         .pipe(
//             tap(() => this.loadItems())
//         )
//         .subscribe();
//   }

//   sortData(e) {
//     this.loadItems();
//   }


  openAddModeal() {

    let dialogRef = this.dialog.open(AddCustomersComponent, {
      height: '500px',
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(res => {
		if(res != undefined){
			if (res.isTrue == true ){
				this.openSnackBar(res.message , '')
				this.loadCustomers()
			}
		}
    })
  }

  openEditModeal(customer) {

    let dialogRef = this.dialog.open(EditCustomersComponent, {
      height: '500px',
      width: '60%',
      data: customer,
    });

    dialogRef.afterClosed().subscribe(res => {
		if(res != undefined){
			if (res.isTrue == true ){
				this.openSnackBar(res.message , '')
				this.loadCustomers()
			}
		}
    })
  }

  openPayModeal(customer) {

    let dialogRef = this.dialog.open(PayDebtComponent, {
      height: '500px',
      width: '60%',
      data: customer,
    });

    dialogRef.afterClosed().subscribe(res => {
		if(res != undefined){
			if (res.isTrue == true ){
				this.openSnackBar(res.message , '')
				this.loadCustomers()
			}
		}
    })
  }

  openAddInvoiceModeal(customer) {

    let dialogRef = this.dialog.open(AddInvoiceComponent, {
      height: '500px',
      width: '60%',
      data: customer,
    });

    dialogRef.afterClosed().subscribe(res => {
		if(res != undefined){
			if (res.isTrue == true ){
				this.openSnackBar(res.message , '')
				this.loadCustomers()
			}
		}
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onKeyUp(){
	this.selectedRadioOption = 'الكل'
	this.loadCustomers();
  }
  updateTable(){
	this.tableCustomers = [];
	this._customerService.getCustomers({}).subscribe(res=>{
		if(this.selectedRadioOption == 'مع دين'){
			// for(let x = 0; x < res['invoices'].length; x++){
			// 	if(res['invoices'][x].remaining_amount != 0){

			// 	}
			// }
			res['customers'].forEach(invoice => {
				if(invoice.credit != 0){
					this.tableCustomers.push(invoice)
				}
			});
			this.dataSource = new MatTableDataSource(this.tableCustomers);
			this.dataSource.paginator = this.paginator;
		}else{
			this.tableCustomers = res['customers'];
			this.dataSource = new MatTableDataSource(this.tableCustomers);
			this.dataSource.paginator = this.paginator;
		}
	})


  }
}


