import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AllCustomersService } from './../../../../core/_services/all-customers.service';
import { invoicesService } from './../../../../core/_services/invoices.service';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { AllItemsService } from '../../../../core/_services/all-Items.service';
import { AddItemComponent } from '../add-item/add-item.component';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { ItemService } from '../../../../core/_services/items.service';


@Component({
  selector: 'kt-view-sells',
  templateUrl: './view-sells.component.html',
  styleUrls: ['./view-sells.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewSellsComponent implements OnInit {
	payed_amount_storage = "";
	payedPrice;
	items = [];
	customers = [];
	tableItems = [];
	dataSource ;
	selectedCustomers;
	customerName;
  	customerId = null;
  	changedCustomerId = null;
	selectedItems: any;
	selectedItem;
  	removedItemId = [];
  	newTableItems = [];
  	newTableItemsIds = [];
	  itemsIsLoaded = false;
	  isItemSearchOptionShow = false;
	_reciptForm;
	invoice_id;
	thereIsRemovedItem = false ;
	thereIsDecreasedItem = false ;
	thereIsIncreasedItem = false ;
	countIsOne = false ;
	thereIsEditedItem = false ;
	cleanedItem;
	theDifferenceBetweenOldAndEditedNumber : number;
	displayedColumns: string[] = ['edit', 'name', 'price', 'count', 'total_price','delete'];
	invoiceInfo = {
		invoiceNumber: "",
		totalPrice: 0,
		totalCost: 0,
		payed_amount: null,
		date: new Date(),
	  };



  constructor(
	private _allItemService: AllItemsService,
	private _itemService: ItemService,
	private _customersService: AllCustomersService,
	private _httpInvoice: invoicesService,
	private fb: FormBuilder,
	private cd: ChangeDetectorRef,
	public dialog: MatDialog,
	private _snackBar: MatSnackBar

  ) { }

  ngOnInit() {
	document.getElementById('isio-item').focus();
	  this._allItemService.getItems({}).subscribe(res => {
		this.items = res['items'];
		this.cd.markForCheck();
	});
	  this._customersService.getCustomers({}).subscribe(res => {
		this.customers = res['customers'];
		this.cd.markForCheck();
	});

	this.dataSource = new MatTableDataSource<any>(this.tableItems);
	this._reciptForm = this.fb.group({
		id: new FormControl('', [
		  Validators.required,
		  CustomValidators.number,
		])
	  });
}

addItemToTable(item:any){
	if(this.itemsIsLoaded === false){
		// this.selectedItems = [];
		let itemExist = false;
		let itemIndex;
		let newItem = {
			id: item.id,
			name: item.name,
			barcode: item.barcode,
			buy_price: item.buy_price,
			sell_price: item.sell_price,
			count: 1,
			quantity: item.quantity,
		};

		for (let x = 0; x < this.tableItems.length; x++){
			if (this.tableItems[x].id === item.id){
				itemExist = true;
				itemIndex = x;
			}
		}

		if (itemExist){
			this.tableItems[itemIndex].count = this.tableItems[itemIndex].count + 1;
		}
		else {
			this.tableItems.unshift(newItem);
		}
		console.log(this.cleanedItem)
		if(!this.cleanedItem){
			this.calcluteTotalPrice(item);
		}
		this.reloadDataSource();
	}else{
			// if(this.thereIsIncreasedItem){
				// this.thereIsIncreasedItem=false;
				let itemExist = false;
				let loadedItem = false;
				let itemIndex;
				let newItem = {
					id: item.id,
					name: item.name,
					barcode: item.barcode,
					buy_price: item.buy_price,
					sell_price: item.sell_price,
					count: 1,
					quantity: item.quantity,
				};


				for (let x = 0; x < this.tableItems.length; x++){
					if(Boolean(item.invoice_id) == true){

						if (this.tableItems[x].item_id === item.item_id){
							itemExist = true;
							itemIndex = x;
						}
					}
					else{
						if (this.tableItems[x].item_id){
							if(this.tableItems[x].item_id === item.id){
								if(this.tableItems[x].sell_price != item.sell_price || this.tableItems[x].buy_price != item.buy_price || this.tableItems[x].barcode != item.barcode || this.tableItems[x].name != item.name){
									return this.openSnackBar("لا يمكن الاضافة لان المنتج تم تغييره", "")
								}
								itemExist = true;
								itemIndex = x;
							}
						}else{
							if(this.tableItems[x].id === item.id){
								itemExist = true;
								itemIndex = x;
							}
						}
					}
				}

				if (itemExist){
					this.tableItems[itemIndex].count = this.tableItems[itemIndex].count + 1;
				}
				else{
					this.tableItems.unshift(newItem);
					this.newTableItemsIds.push(item.id)
				}
				if(!this.cleanedItem){
					this.calcluteTotalPrice(item);
				}
				this.reloadDataSource();
			// }
			// else{
			// 	let itemExist = false;
			// 	let loadedItem = false;
			// 	let itemIndex;
			// 	for (let x = 0; x < this.tableItems.length; x++){
			// 		if(Boolean(item.invoice_id) == true){
			// 			if (this.tableItems[x].item_id === item.item_id){
			// 				itemExist = true;
			// 				itemIndex = x;
			// 			}
			// 		}
			// 		else{
			// 			if (this.tableItems[x].item_id){
			// 				if(this.tableItems[x].item_id === item.id){
			// 					itemExist = true;
			// 					itemIndex = x;
			// 				}
			// 			}else{
			// 				if(this.tableItems[x].id === item.id){
			// 					itemExist = true;
			// 					itemIndex = x;
			// 				}
			// 			}
			// 		}
			// 	}
			// }
		}

}

removeItemFromTable(item){
	for (let x = 0; x < this.tableItems.length; x++){
	  if (this.tableItems[x].item_id === item.item_id && Boolean(item.invoice_id) == true){
		this.tableItems.splice(x, 1);
		this.removedItemId.push(item.id);
		this.thereIsRemovedItem = true;

	  }else if (this.tableItems[x].id === item.id && Boolean(item.invoice_id) == false){
		this.tableItems.splice(x, 1);
		this.thereIsRemovedItem = true;
	  }
	}

	if(!this.cleanedItem){
		this.calcluteTotalPrice(item);
	}else{
		this.thereIsRemovedItem = false;
	}
	this.reloadDataSource();
}

reloadDataSource(){
	this.dataSource = new MatTableDataSource<any>(this.tableItems);
}

increaseItemCount(item){
	this.thereIsIncreasedItem = true;
	this.addItemToTable(item);
}

decreaseItemCount(item){
	for (let x = 0; x < this.tableItems.length; x++){
		if(item.invoice_id){
			if (this.tableItems[x].item_id === item.item_id){
				if(this.tableItems[x].count != 1){
					this.tableItems[x].count -= 1;
				}
				else{
					this.countIsOne = true
				}
			}
		}
		else{
			if (this.tableItems[x].id === item.id){
				if(this.tableItems[x].count != 1){
					this.tableItems[x].count -= 1;
				}
				else{
					this.countIsOne = true
				}
			}
		}
	}
	this.thereIsDecreasedItem = true;
	this.calcluteTotalPrice(item);
	this.reloadDataSource();
}

calcluteTotalPrice(item){
	if(this.itemsIsLoaded === false){
		this.thereIsEditedItem = false
		let totalPrice = 0;
		let totalCost = 0;
		for (let x = 0; x < this.tableItems.length; x++){
		  totalPrice += this.tableItems[x].sell_price * this.tableItems[x].count;
		  totalCost += this.tableItems[x].buy_price * this.tableItems[x].count;
		}
		this.invoiceInfo.totalPrice = totalPrice;
		this.invoiceInfo.totalCost = totalCost;
		this.payed_amount_storage = `${totalPrice}`;
	}else{
		console.log("calculating")
			let payed_amount = 0;
			let totalPrice = 0;
			let totalCost = 0;
			for (let x = 0; x < this.tableItems.length; x++){
			  totalPrice += this.tableItems[x].sell_price * this.tableItems[x].count;
			  totalCost += this.tableItems[x].buy_price * this.tableItems[x].count;
			}
			if(this.thereIsRemovedItem == true){
				this.thereIsRemovedItem = false;
				payed_amount = parseInt(this.payed_amount_storage) - item.sell_price*item.count;
				if(payed_amount < 0){
					payed_amount = 0;
					this.openSnackBar("تم تصفير المبلغ المدفوع","");
				}
			}
			else if(this.thereIsDecreasedItem == true){
				this.thereIsDecreasedItem = false;
				payed_amount = parseInt(this.payed_amount_storage)
				if(!this.countIsOne){
					payed_amount = parseInt(this.payed_amount_storage) - item.sell_price;
				}
				this.countIsOne = false
				if(payed_amount < 0){
					payed_amount = 0;
					this.openSnackBar("تم تصفير المبلغ المدفوع","");
				}
			}
			else if(this.thereIsEditedItem == true){
				this.thereIsEditedItem = false;
				payed_amount = parseInt(this.payed_amount_storage) - this.theDifferenceBetweenOldAndEditedNumber;
				console.log(payed_amount)
				console.log(parseInt(this.payed_amount_storage))
				console.log(this.theDifferenceBetweenOldAndEditedNumber)

				if(payed_amount < 0){
					payed_amount = 0;
					this.openSnackBar("تم تصفير المبلغ المدفوع","");
				}
			}
			else{
				payed_amount = parseInt(this.payed_amount_storage) + item.sell_price;
			}
			this.payed_amount_storage = `${payed_amount}`;
			this.invoiceInfo.totalPrice = totalPrice;
			this.invoiceInfo.totalCost = totalCost;

	}
  }

  onAdditem(item){
	this.isItemSearchOptionShow = false;
	this.selectedItem = "";
	this.addItemToTable(item);
  }
  onAddcustomer(customer){
  this.customerName = customer.name;

  if(this.customerId === null){
    this.customerId = customer.id;
  }else{
    this.changedCustomerId = customer.id;
  }

	this.selectedCustomers = [];
  }

  loadInvoice(){
    this.itemsIsLoaded = true;
    this._httpInvoice.getInvoice(this._reciptForm.value.id).subscribe(res => {
	  this.payed_amount_storage = res['payed_amount']
	  this.removedItemId = []
      this.invoice_id= res['id'];
      this.tableItems = res['invoiceitems'].reverse();
      this._reciptForm.controls.id.setValue(res['id']);
	  this.selectedCustomers = [];
	  if(res['customer'] == null ){
        this.customerName = 'غير مسجل';
      }else{
        this.customerName = res['customer'].name;
        this.customerId = res['customer'].id;
      }

      this.invoiceInfo = {
        invoiceNumber: "",
        totalPrice: res['total_amount'],
        totalCost: res['total_cost'],
        payed_amount: null,
        date: new Date(res['created_at']),
	  };
	  this.reloadDataSource();
	  this.cd.markForCheck();
    },
    err => {
      this.openNewInvoice();
    }
    );
  }

  loadPrevInvoice(){
    this.itemsIsLoaded = true;
    if(this._reciptForm.value.id == false){
      this._reciptForm.value.id = 0
    }
    this._httpInvoice.getPrevInvoice(this._reciptForm.value.id).subscribe(res => {
		this.payed_amount_storage = res['payed_amount']
	  this.removedItemId = []
      this.invoice_id= res['id'];
      this.tableItems = res['invoiceitems'].reverse();
      this._reciptForm.controls.id.setValue(res['id']);
      if(res['customer'] == null ){
        this.customerName = 'غير مسجل';
      }else{
		this.customerName = res['customer'].name;
		this.customerId = res['customer'].id;
      }
      this.invoiceInfo = {
        invoiceNumber: "",
		totalPrice: res['total_amount'],
		totalCost: res['total_cost'],
        payed_amount: null,
        date: new Date(res['created_at']),
	  };
	  this.reloadDataSource();
	  this.cd.markForCheck();
    },
    err => {
      this.openNewInvoice();
    }
    );
  }

  loadNextInvoice(){
    this.itemsIsLoaded = true;
    if(this._reciptForm.value.id == false){
      this._reciptForm.value.id = 0
    }
    this._httpInvoice.getNextInvoice(this._reciptForm.value.id).subscribe(res => {
		this.payed_amount_storage = res['payed_amount'];
	  this.removedItemId = []
      this.invoice_id= res['id'];
      this.tableItems = res['invoiceitems'].reverse();
	  this._reciptForm.controls.id.setValue(res['id']);
      if(res['customer'] == null ){
        this.customerName = 'غير مسجل';
      }else{
		this.customerName = res['customer'].name;
		this.customerId = res['customer'].id;
      }
      this.invoiceInfo = {
        invoiceNumber: "",
		totalPrice: res['total_amount'],
		totalCost: res['total_cost'],
        payed_amount: null,
        date: new Date(res['created_at']),
      };
	  this.reloadDataSource();
	  this.cd.markForCheck();
    },
    err => {
      this.openNewInvoice();
    }
    );
  }

  openNewInvoice(){
	this.payed_amount_storage = "";
  this.itemsIsLoaded = false;
	this.tableItems = [];
	this.customerName = null;
  this.customerId = null;
  this.changedCustomerId = null;
	this.removedItemId = [];
	this.newTableItemsIds = [];
	this.newTableItems = [];
    this._reciptForm.controls.id.setValue("");
    this.invoiceInfo = {
      invoiceNumber: "",
	  totalPrice: 0,
	  totalCost: 0,
      payed_amount: null,
      date: new Date(),
	};
	this.reloadDataSource();
  }

  submit(){
	if(!this.invoiceInfo.payed_amount){
		this.invoiceInfo.payed_amount = this.payed_amount_storage;
	  }
    let sendObject : any = {};
    if (this._reciptForm.value.id === '') {
	  sendObject.payed_amount = this.invoiceInfo.payed_amount;

      if (!this.customerId) {
        sendObject.customer_id = -1;
      } else {
        sendObject.customer_id = this.customerId;
      }

	  sendObject.total_amount = this.invoiceInfo.totalPrice;
	  sendObject.total_cost = this.invoiceInfo.totalCost;
      sendObject.items = [];
      for (let x = 0; x < this.tableItems.length; x++){
		sendObject.items[x] = {id: this.tableItems[x].id, count: this.tableItems[x].count};
	  }
	  sendObject.total_amount = parseFloat(sendObject.total_amount);
	  sendObject.payed_amount = parseFloat(sendObject.payed_amount);
	  sendObject.date = this.invoiceInfo.date;
      this._httpInvoice.addInvoice(sendObject).subscribe(res => {
		this.openNewInvoice();
		this.cd.markForCheck();
      });
    }
}

   submitWithPrint(){
	if(!this.invoiceInfo.payed_amount){
		this.invoiceInfo.payed_amount = this.payed_amount_storage;
	  }
    let sendObject : any = {};
    if (this._reciptForm.value.id === '') {
	  sendObject.payed_amount = this.invoiceInfo.payed_amount;

      if (!this.customerId) {
        sendObject.customer_id = -1;
      } else {
        sendObject.customer_id = this.customerId;
      }

	  sendObject.total_amount = this.invoiceInfo.totalPrice;
	  sendObject.total_cost = this.invoiceInfo.totalCost;
      sendObject.items = [];
      for (let x = 0; x < this.tableItems.length; x++){
		sendObject.items[x] = {id: this.tableItems[x].id, count: this.tableItems[x].count};
	  }
	  sendObject.total_amount = parseFloat(sendObject.total_amount);
	  sendObject.payed_amount = parseFloat(sendObject.payed_amount);
	  sendObject.date = this.invoiceInfo.date;
      this._httpInvoice.addInvoice(sendObject).subscribe(res => {
		this.print({sendObject:sendObject, invoice:res['invoice'], invoice_items:res['invoice_items'], customerName:this.customerName});
		this.openNewInvoice();
		this.cd.markForCheck();
      });
    }
}

print(invoiceToPrintInfo){
	localStorage.setItem("invoiceToPrint", JSON.stringify(invoiceToPrintInfo));
	let w = window.open("invoice.html");
	setTimeout(() => {
		w.print();
		w.close();
	}, 500)
}

  updateInvoice(){
	  if(!this.invoiceInfo.payed_amount){
		this.invoiceInfo.payed_amount = this.payed_amount_storage;
	  }
	  let sendObject : any = {};
	  if (this._reciptForm.value.id !== '') {

		  sendObject.payed_amount = this.invoiceInfo.payed_amount;

		  if (this.customerId === null) {
			  sendObject.customer_id = -1;
			}else if(this.changedCustomerId !== null) {
				sendObject.customer_id = this.changedCustomerId;
			}else{
				sendObject.customer_id = this.customerId;
			}

			sendObject.total_amount = this.invoiceInfo.totalPrice ;
			sendObject.total_cost = this.invoiceInfo.totalCost;
			sendObject.invoice_id = this.invoice_id;
			sendObject.removed_items = [];

			for (let x = 0; x < this.removedItemId.length; x++){
				sendObject.removed_items[x] = this.removedItemId[x];
			}


			this.newTableItemsIds.forEach(newItem => {
				this.tableItems.forEach(tableitem =>{
					if(newItem == tableitem.id){
						return this.newTableItems.push(tableitem);
					}
				})
			})


      for(let x = 0; x < this.tableItems.length; x++){
		  if(Boolean(this.tableItems[x].invoice_id) == false){
			this.newTableItems.every(newTableItem =>{
				if(newTableItem.id == this.tableItems[x].id){
					this.tableItems.splice(x,1);
					x=x-1 ;
					return false
				}else{
					return true;
				}

			})
		  }
	  }
      sendObject.items = [];
      for (let x = 0; x < this.tableItems.length; x++){
      sendObject.items[x] = {id: this.tableItems[x].item_id, count: this.tableItems[x].count,invoice_item_id: this.tableItems[x].id };
	  }

	  sendObject.newItems = []
	  for (let x = 0; x < this.newTableItems.length; x++){
		sendObject.newItems[x] = {id: this.newTableItems[x].id, count: this.newTableItems[x].count};
		}

	  sendObject.thereIsRemovedItem =  this.thereIsRemovedItem;

	  sendObject.total_amount = parseFloat(sendObject.total_amount);
	  sendObject.payed_amount = parseFloat(sendObject.payed_amount);
	  console.log(sendObject);
      this._httpInvoice.updateInvoice(sendObject).subscribe(res => {
      this.openNewInvoice();
      this.cd.markForCheck();
      });
    }
  }

  updateInvoiceWithPrint(){
	  if(!this.invoiceInfo.payed_amount){
		this.invoiceInfo.payed_amount = this.payed_amount_storage;
	  }
	  let sendObject : any = {};
	  if (this._reciptForm.value.id !== '') {

		  sendObject.payed_amount = this.invoiceInfo.payed_amount;

		  if (this.customerId === null) {
			  sendObject.customer_id = -1;
			}else if(this.changedCustomerId !== null) {
				sendObject.customer_id = this.changedCustomerId;
			}else{
				sendObject.customer_id = this.customerId;
			}

			sendObject.total_amount = this.invoiceInfo.totalPrice ;
			sendObject.total_cost = this.invoiceInfo.totalCost;
			sendObject.invoice_id = this.invoice_id;
			sendObject.removed_items = [];

			for (let x = 0; x < this.removedItemId.length; x++){
				sendObject.removed_items[x] = this.removedItemId[x];
			}


			this.newTableItemsIds.forEach(newItem => {
				this.tableItems.forEach(tableitem =>{
					if(newItem == tableitem.id){
						return this.newTableItems.push(tableitem);
					}
				})
			})


      for(let x = 0; x < this.tableItems.length; x++){
		  if(Boolean(this.tableItems[x].invoice_id) == false){
			this.newTableItems.every(newTableItem =>{
				if(newTableItem.id == this.tableItems[x].id){
					this.tableItems.splice(x,1);
					x=x-1 ;
					return false
				}else{
					return true;
				}

			})
		  }
	  }
      sendObject.items = [];
      for (let x = 0; x < this.tableItems.length; x++){
      sendObject.items[x] = {id: this.tableItems[x].item_id, count: this.tableItems[x].count,invoice_item_id: this.tableItems[x].id };
	  }

	  sendObject.newItems = []
	  for (let x = 0; x < this.newTableItems.length; x++){
		sendObject.newItems[x] = {id: this.newTableItems[x].id, count: this.newTableItems[x].count};
		}

	  sendObject.thereIsRemovedItem =  this.thereIsRemovedItem;

	  sendObject.total_amount = parseFloat(sendObject.total_amount);
	  sendObject.payed_amount = parseFloat(sendObject.payed_amount);
      this._httpInvoice.updateInvoice(sendObject).subscribe(res => {
	  this.print({sendObject:sendObject, invoice:res['invoice'], invoice_items:res['invoice_items'], customerName:this.customerName});
      this.openNewInvoice();
      this.cd.markForCheck();
      });
    }
  }

  saveButtonDisabled(){
	if (this._reciptForm.value.id === ''){
		return false
	}else{
		return true
	}
  }

  saveChangesDisabled(){
	if (this._reciptForm.value.id !== ''){
		return false
	}else{
		return true
	}
  }

//   onKeyUp(payed_amount){
// 	this.invoiceInfo.payed_amount += payed_amount;
//   }
lastItemSearch = 0;
onItemsSearch(item){

	this.isItemSearchOptionShow = true;
	if (Date.now() - this.lastItemSearch < 50 ) {
		this.selectedItem = "";
		return;
	}
	if(!isNaN(item.target.value.charAt(0))){
		if (item.key == "Enter"){
			let searched_item = item.target.value;
			this.selectedItem = "";
			this.isItemSearchOptionShow = false;

			this.lastItemSearch = Date.now();
			this._allItemService.getItemsOnEnter({search:item.target.value}).subscribe(res => {
				if(res['count'] == 1){
					this.addItemToTable(res['items'][0]);
				}else if (res['count'] == 0){
					this.openAddModeal(searched_item)

				}else{
					this.openSnackBar("هناك اكثر من مادة واحدة لهذا الباركود","");
				}
				this.cd.markForCheck();


			},
			err => {

			});
		}
	}
	else{
		this._allItemService.getItems({search:item.target.value}).subscribe(res => {
			this.items = res['items'];
			this.cd.markForCheck();
		});
	}

}

onCustomersSearch(CustomersToSearchFor){
	this._allItemService.getItems({search:CustomersToSearchFor}).subscribe(res => {
		this.items = res['customers'];
		this.cd.markForCheck();
	});
}

openAddModeal(barcode) {

    let dialogRef = this.dialog.open(AddItemComponent, {
      height: '600px',
	  width: '60%',
	  data: barcode
    });

    dialogRef.afterClosed().subscribe(res => {
		if(res != undefined){
			if(res.addedItem){
				this.addItemToTable(res.addedItem)
			}
			if (res.isTrue == true ){
				this.openSnackBar(res.message , '')
				this._allItemService.getItems({}).subscribe(res => {
					this.items = res['items'];
					this.cd.markForCheck();
				});
			}
		}
    })
  }


	openSnackBar(message: string, action: string) {
		this._snackBar.open(message, action, {
		duration: 5000,
		});
	}

	onWindowClick(){
		this.isItemSearchOptionShow = false
		document.getElementById('isio-item').focus();
	}

	editItemOfTable(item){
		this.cleanedItem = null;
		let cleanedItemCount;
		let dialogRef;
		let oldPrice = item.sell_price * item.count;
		this.thereIsEditedItem = true;
		if(item.invoice_id){
			cleanedItemCount = item.count
			this._itemService.getItem(item.item_id).subscribe(res=>{
				this.cleanedItem = res;
				this.removeItemFromTable(item)
				this.addItemToTable(this.cleanedItem)
				dialogRef = this.dialog.open(EditItemComponent, {
					height: '600px',
					width: '60%',
					data: this.cleanedItem
				});
				dialogRef.afterClosed().subscribe(res => {
					if(res){
						if (res.isTrue == true ){
							this.openSnackBar(res.message , '')
							this._allItemService.getItems({}).subscribe(res => {
								this.items = res['items'];
								this.cd.markForCheck();
							});
						}
						}
						for (let x = 0; x < this.tableItems.length; x++){
								if (this.tableItems[x].id === res.item.id){
									if(this.cleanedItem){
										this.tableItems[x].count = cleanedItemCount;
									}
									this.tableItems[x].name = res.item.name;
									this.tableItems[x].barcode = res.item.barcode;
									this.tableItems[x].buy_price = res.item.buy_price;
									this.tableItems[x].sell_price = res.item.sell_price;
									this.tableItems[x].quantity = res.item.quantity;
									this.theDifferenceBetweenOldAndEditedNumber = oldPrice - res.item.sell_price*this.tableItems[x].count;
									this.calcluteTotalPrice(this.tableItems[x]);
									console.log("i'm in the celaned item")
								}
						}
						this.thereIsEditedItem = false;
						this.cleanedItem = null;
					})
			})
		}
		else{
			dialogRef = this.dialog.open(EditItemComponent, {
				height: '600px',
				width: '60%',
				data: item
			});
			dialogRef.afterClosed().subscribe(res => {
				if(res){
					if (res.isTrue == true ){
						this.openSnackBar(res.message , '')
						this._allItemService.getItems({}).subscribe(res => {
							this.items = res['items'];
							this.cd.markForCheck();
						});
					}
					}
					for (let x = 0; x < this.tableItems.length; x++){
							if (this.tableItems[x].id === res.item.id){
								this.tableItems[x].name = res.item.name;
								this.tableItems[x].barcode = res.item.barcode;
								this.tableItems[x].buy_price = res.item.buy_price;
								this.tableItems[x].sell_price = res.item.sell_price;
								this.tableItems[x].quantity = res.item.quantity;
								console.log("i'm in normal")
								this.theDifferenceBetweenOldAndEditedNumber = oldPrice - res.item.sell_price*this.tableItems[x].count;
								this.calcluteTotalPrice(this.tableItems[x]);
							}
					}
					this.thereIsEditedItem = false;
				})
		}
	}
}
