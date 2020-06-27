import { Component, OnInit, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatChipInputEvent, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { ItemService } from './../../../../core/_services/items.service';

@Component({
  selector: 'kt-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {

	public _form: FormGroup;
	addedItem;
	constructor(
		public snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<AddItemComponent>,
		private itemService : ItemService ,
		@Inject(MAT_DIALOG_DATA) public data: any,
		) {}
			ngOnInit() {
				this.buildForm();
				console.log(this.data)
			}

			closeWithResult(){
				this.dialogRef.close("reload");
			}

			buildForm() {
				this._form = new FormGroup({
					name: new FormControl('', [

						Validators.required,
						CustomValidators.rangeLength([2, 100]),


					]),
					buy_price: new FormControl('', [
						Validators.required,
						CustomValidators.number
					]),
					sell_price: new FormControl('', [
						Validators.required,
						CustomValidators.number
					]),
					barcode: new FormControl(this.data, [
						CustomValidators.number
					]),
					quantity: new FormControl('', [
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
		this.itemService.addItems(this._form.value).subscribe(res => {
			if(res){
				this.addedItem = res ;
			}
			this.dismiss(true, "تمت الأضافة بنجاح",this.addedItem);
		  });

	}

	dismiss(isTrue = false, message = "" , addedItem){
		this.dialogRef.close({isTrue , message , addedItem});
	  }
}
