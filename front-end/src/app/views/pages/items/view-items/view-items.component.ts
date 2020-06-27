import { AddItemComponent } from './../add-item/add-item.component';
import { EditItemComponent } from './../edit-item/edit-item.component';
import { ItemService } from './../../../../core/_services/items.service';
import { ItemsDataSource } from '../../../../core/_datasources/items.datasource';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { of, interval } from 'rxjs';
import { FormControl } from '@angular/forms';
import { DeleteItemComponent } from '../delete-item/delete-item.component';




@Component({
  selector: 'kt-view-items',
  templateUrl: './view-items.component.html',
  styleUrls: ['./view-items.component.scss'],

})
export class ViewItemsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'buy_price', 'sell_price', 'quantity', 'barcode','options'];
//   dataSource : ItemsDataSource;
  dataSource;
  tableItems = [];
  selectedRadioOption:string = 'الكل';
  radioOptions = ['المحذوفات', 'الكل']
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
	static editItem: any;
	static editedItem: any;
	search_item_input = new FormControl();

  constructor(
    public dialog: MatDialog,
	private _itemService: ItemService,
	private _snackBar: MatSnackBar) { }


  ngOnInit() {
	  this.loadItems();
  }

  loadItems(){
	  if(!this.search_item_input.value){
		this._itemService.getItems({selectedRadioOption:this.selectedRadioOption}).subscribe(res=>{
			this.tableItems = res['items'];
			this.dataSource = new MatTableDataSource(this.tableItems);
			this.dataSource.paginator = this.paginator;
		  })
	  }else{
		this._itemService.getItems({search : this.search_item_input.value,selectedRadioOption:this.selectedRadioOption }).subscribe(res=>{
			this.tableItems = res['items'];
			this.dataSource = new MatTableDataSource(this.tableItems);
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

    let dialogRef = this.dialog.open(AddItemComponent, {
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

  openDeleteModeal(item) {

    let dialogRef = this.dialog.open(DeleteItemComponent, {
      height: '600px',
	  width: '60%',
	  data: item,
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

    let dialogRef = this.dialog.open(EditItemComponent, {
      height: '600px',
	  width: '60%',
	  data: item,
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  tableIndex
  tableNumber(element){
	this.tableIndex = 1;
	return this.tableIndex += this.tableItems.map(function(e) { return e.id; }).indexOf(element.id)
  }

  onKeyUp(){
	this.loadItems();
  }

  updateTable(){
	this.tableItems = [];
	if(!this.search_item_input.value){
		this._itemService.getItems({selectedRadioOption:this.selectedRadioOption}).subscribe(res=>{
			this.tableItems = res['items'];
			this.dataSource = new MatTableDataSource(this.tableItems);
			this.dataSource.paginator = this.paginator;
		  })
	  }else{
		this._itemService.getItems({search : this.search_item_input.value,selectedRadioOption:this.selectedRadioOption }).subscribe(res=>{
			this.tableItems = res['items'];
			this.dataSource = new MatTableDataSource(this.tableItems);
			this.dataSource.paginator = this.paginator;
		  })
	  }


  }

  restore(item){
	this._itemService.restoreItem(item).subscribe(res=>{
		this.openSnackBar("تم الاستعادة" , '')
		this.loadItems();
	})
  }


}
