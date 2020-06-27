import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatChipInputEvent, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { invoicesService } from './../../../../core/_services/invoices.service';
import { AllCustomersService } from './../../../../core/_services/all-customers.service';

@Component({
	selector: 'kt-add-invoices',
	templateUrl: './add-invoices.component.html',
	styleUrls: ['./add-invoices.component.scss']
  })
export class AddInvoicesComponent implements OnInit {

	public _form: FormGroup;
	addedItem;
	selectedCustomers;
	customers;
	customerId;
	constructor(
		public snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<AddInvoicesComponent>,
		private invoiceService : invoicesService ,
		private _customersService : AllCustomersService
		) {}
			ngOnInit() {
				this._customersService.getCustomers({}).subscribe(res => {
					this.customers = res['customers'];
				});
				this.buildForm();

			}

			closeWithResult(){
				this.dialogRef.close("reload");
			}

			buildForm() {
				this._form = new FormGroup({
					customer_id: new FormControl(-1, [
						CustomValidators.number,
					]),
					total_amount: new FormControl('', [
						Validators.required,
						CustomValidators.number
					]),
					payed_amount: new FormControl('', [
						Validators.required,
						CustomValidators.number
					]),
				});

			}

			hasError(controlName : string, errorName : string){
				return this._form.controls[controlName].hasError(errorName);
			}

			isInValidInput(controlName : string) {
				if (this._form.controls[controlName].untouched)
				return false;
				return this._form.controls[controlName].invalid;

			}

			isValidInput(controlName : string){
				if (this._form.controls[controlName].untouched)
				return false;
				return this._form.controls[controlName].valid;
			}

	getInputValue(controlName: string) {
		return this._form.controls[controlName].value;
	}


	onSubmit() {
		if(this.customerId){
			this._form.value.customer_id = this.customerId
		}
		this.invoiceService.addInvoice(this._form.value).subscribe(res => {
			this.addedItem = res ;
			this.dismiss(true, "تم التعديل بنجاح",this.addedItem);
		  });

	}

	dismiss(isTrue = false, message = "" , addedItem){
		this.dialogRef.close({isTrue , message , addedItem});
	  }

	onAddcustomer(customer){
		  this.customerId = customer.id;
	}
}
