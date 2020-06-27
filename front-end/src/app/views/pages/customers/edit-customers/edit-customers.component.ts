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

@Component({
	selector: 'kt-edit-customers',
	templateUrl: './edit-customers.component.html',
	styleUrls: ['./edit-customers.component.scss']
})
export class EditCustomersComponent implements OnInit {
	editedItem;
	public _form: FormGroup;

	constructor(
		public snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<EditCustomersComponent>,
		private customerService : CustomerService ,
		@Inject(MAT_DIALOG_DATA) public data: any
		) {}
			ngOnInit() {
				this.buildForm();
			}

			closeWithResult(){
				this.dialogRef.close("reload");
			}

			buildForm() {
				this._form = new FormGroup({
					name: new FormControl( this.data.name , [

						Validators.required,
						CustomValidators.rangeLength([2, 100]),


					]),
					phone: new FormControl(this.data.phone, [
						Validators.required,
						CustomValidators.number
					]),
					credit: new FormControl(this.data.credit, [
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
		this.customerService.updateCustomer(this.data.id , this._form.value).subscribe(res => {
			this.dismiss(true, "تم التعديل بنجاح");
		  });

	}

	dismiss(isTrue = false, message = ""){
		this.dialogRef.close({isTrue , message});
	  }

}

