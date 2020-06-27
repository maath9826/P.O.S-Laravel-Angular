import { Component, OnInit, Input , AfterViewInit, ViewChild, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatChipInputEvent, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { ItemService } from './../../../../core/_services/items.service';
import { CustomerService } from './../../../../core/_services/customer.service';
import { ViewCustomersComponent } from '../view-customers/view-customers.component';
import { ConfirmPayDebtComponent } from '../confirm-pay-debt/confirm-pay-debt.component';

@Component({
	selector: 'kt-pay-debt',
  templateUrl: './pay-debt.component.html',
  styleUrls: ['./pay-debt.component.scss']
})
export class PayDebtComponent implements OnInit {
	editedItem;
	// @Input() customer_id: number;
	// @Input() credit: string;
	credit;
	public _form: FormGroup;
	payed_debt = new FormControl("",[
		Validators.required
	]);

	constructor(
		public dialogRef: MatDialogRef<PayDebtComponent>,
		private customerService : CustomerService ,
		private dialog : MatDialog,
		private _snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public data: any
		) {}

		ngOnInit() {
			this.credit = this.data.credit;
			console.log(this.data.id)
			console.log(this.data.credit)
		}

		closeWithResult(){
			this.dialogRef.close("reload");
		}



	onSubmit() {
			if(this.payed_debt.value <= this.credit && 0 <= this.payed_debt.value){
			let dialogRef = this.dialog.open(ConfirmPayDebtComponent, {
				height: '500px',
				width: '60%',
				data: {customer_id : this.data.id,payed_debt:this.payed_debt.value},
			});

			dialogRef.afterClosed().subscribe(res => {
				if(res){
					this.dismiss(true, "تم التعديل بنجاح");
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

