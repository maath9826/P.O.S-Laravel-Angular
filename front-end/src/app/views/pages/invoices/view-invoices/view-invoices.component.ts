import { AddInvoicesComponent } from './../add-invoices/add-invoices.component';
// import { EditItemComponent } from './../edit-item/edit-item.component';
import { invoicesService } from './../../../../core/_services/invoices.service';
import { ItemsDataSource } from '../../../../core/_datasources/items.datasource';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { of, interval } from 'rxjs';
import { FormControl } from '@angular/forms';




@Component({
	selector: 'kt-view-invoices',
	templateUrl: './view-invoices.component.html',
	styleUrls: ['./view-invoices.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
  })
export class ViewInvoicesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'customerName', 'total_amount', 'payed_amount', 'remaining_amount'];
//   dataSource : ItemsDataSource;
  dataSource;
  tableInvoices = [];
  selectedInvoices = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
	static editItem: any;
	static editedItem: any;
	search_invoice_input = new FormControl
	selectedRadioOption:string = 'الكل';
	radioOptions = ['مع دين', 'الكل']

  constructor(
    public dialog: MatDialog,
	private _invoiceService: invoicesService,
	private _snackBar: MatSnackBar,
	private cd: ChangeDetectorRef) { }


  ngOnInit() {
	  this.loadItems();
  }

  loadItems(){
	if(!this.search_invoice_input.value){
		this._invoiceService.getInvoices({}).subscribe(res=>{
			this.tableInvoices = res['invoices'];
			this.dataSource = new MatTableDataSource(this.tableInvoices);
			this.dataSource.paginator = this.paginator;
		  })
	  }else{
		this._invoiceService.getInvoices({search : this.search_invoice_input.value }).subscribe(res=>{
			this.tableInvoices = res['invoices'];
			this.dataSource = new MatTableDataSource(this.tableInvoices);
			this.dataSource.paginator = this.paginator;
		  })
	  }
  }

  // loadItems(){
  //   this.dataSource.loadItems({
  //     _page: this.paginator.pageIndex + 1 || 1,
  //     _limit: this.paginator.pageSize || 0,
  //     _sort: this.sort.active,
  //     _order: this.sort.direction,
	// });



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

    let dialogRef = this.dialog.open(AddInvoicesComponent, {
      height: '600px',
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(res => {
		if(res != undefined){
			if (res.isTrue == true ){
				this.openSnackBar(res.message , '')
				this.loadItems();
			}
		}
    })
  }

  openEditModeal(item) {

    // let dialogRef = this.dialog.open(EditItemComponent, {
    //   height: '600px',
	//   width: '60%',
	//   data: item,
	// });

    // dialogRef.afterClosed().subscribe(res => {
	// 	if(res != undefined){
	// 		if (res.isTrue == true ){
	// 			this.openSnackBar(res.message , '')
	// 			this.loadItems();
	// 		}
	// 	}

    // })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

//   tableIndex
//   tableNumber(element){
// 	this.tableIndex = 1;
// 	return this.tableIndex += this.tableInvoices.map(function(e) { return e.id; }).indexOf(element.id)
//   }

  checkingCustomer(element){
	if(element.customer){
		return element.customer.name;
	}else{
		return 'غير مسجل'
	}
  }

  onKeyUp(){
	this.selectedRadioOption = 'الكل'
	this.loadItems();
  }
  updateTable(){
	this.tableInvoices = [];
	this._invoiceService.getInvoices({}).subscribe(res=>{
		if(this.selectedRadioOption == 'مع دين'){
			// for(let x = 0; x < res['invoices'].length; x++){
			// 	if(res['invoices'][x].remaining_amount != 0){

			// 	}
			// }
			res['invoices'].forEach(invoice => {
				if(invoice.remaining_amount != 0){
					this.tableInvoices.push(invoice)
				}
			});
			this.dataSource = new MatTableDataSource(this.tableInvoices);
			this.dataSource.paginator = this.paginator;
		}else{
			this.tableInvoices = res['invoices'];
			this.dataSource = new MatTableDataSource(this.tableInvoices);
			this.dataSource.paginator = this.paginator;
		}
	})


  }

}

