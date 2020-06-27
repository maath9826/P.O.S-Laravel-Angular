import { Component, OnInit, Input , AfterViewInit, ViewChild, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatChipInputEvent, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { ItemService } from './../../../../core/_services/items.service';
import { CustomerService } from './../../../../core/_services/customer.service';
import { ViewCustomersComponent } from '../view-customers/view-customers.component';
import { invoicesService } from './../../../../core/_services/invoices.service';
import {MatDialog} from '@angular/material';
import { ConfirmAddInvoiceComponent } from '../confirm-add-invoice/confirm-add-invoice.component';

@Component({
	selector: 'kt-add-invoice',
	templateUrl: './add-invoice.component.html',
	styleUrls: ['./add-invoice.component.scss']
})
export class AddInvoiceComponent implements OnInit {
	editedItem;
	// @Input() customer_id: number;
	// @Input() credit: string;
	credit;
	customerName;
	public _form: FormGroup;
	pure_debt = new FormControl("",[
		Validators.required
	]);

	constructor(
		public snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<AddInvoiceComponent>,
		private customerService : CustomerService ,
		private invoiceService : invoicesService ,
		private dialog : MatDialog,
		private _snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public data: any
		) {}

	ngOnInit() {
		this.credit = this.data.credit;
		this.customerName = this.data.name;
		console.log(this.data.id)
		console.log(this.data.credit)
		console.log(this.data.name)
	}

	closeWithResult(){
		this.dialogRef.close("reload");
	}


	onSubmit() {
			if(0 <= this.pure_debt.value){
				let dialogRef = this.dialog.open(ConfirmAddInvoiceComponent, {
					height: '500px',
					width: '60%',
					data: {customer_id : this.data.id,pure_debt:this.pure_debt.value},
				  });

				  dialogRef.afterClosed().subscribe(res => {
					if(res){
						this.dismiss(true, "تم الاضافة");
					}
				})
			}
	}

	openSnackBar(message: string, action: string) {
		this._snackBar.open(message, action, {
		  duration: 2000,
		});
	  }

	dismiss(isTrue = false, message = ""){
		this.dialogRef.close({isTrue , message});
	  }

}

