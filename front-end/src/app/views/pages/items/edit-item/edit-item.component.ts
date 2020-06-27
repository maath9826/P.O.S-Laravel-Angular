import { Component, OnInit, Input , AfterViewInit, ViewChild, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatChipInputEvent, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { ItemService } from './../../../../core/_services/items.service';
import { ViewItemsComponent } from '../view-items/view-items.component';

@Component({
	selector: 'kt-edit-item',
	templateUrl: './edit-item.component.html',
	styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit , AfterViewInit {
	editedItem;
	public _form: FormGroup;

	constructor(
		public snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<EditItemComponent>,
		private itemService : ItemService ,
		@Inject(MAT_DIALOG_DATA) public data: any
		) {}
			ngOnInit() {
				this.buildForm();
			}

			ngAfterViewInit(){
				// this.ViewItemsComponent.editedItem = this.editedItem
			}

			closeWithResult(){
				this.dialogRef.close("reload");
			}

			buildForm() {
				if(this.data.quantity == -1){
					this.data.quantity = ""
				}
				this._form = new FormGroup({
					name: new FormControl( this.data.name , [

						Validators.required,
						CustomValidators.rangeLength([2, 100]),


					]),
					buy_price: new FormControl(this.data.buy_price, [
						Validators.required,
						CustomValidators.number
					]),
					sell_price: new FormControl(this.data.sell_price, [
						Validators.required,
						CustomValidators.number
					]),
					barcode: new FormControl(this.data.barcode, [
						CustomValidators.number
					]),
					quantity: new FormControl(this.data.quantity, [
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
		this._form.value.id= this.data.id;
		this.itemService.updateItem(this._form.value).subscribe(res => {
			this.editedItem = res ;
			this.dismiss(true, "تم التعديل بنجاح" , this.editedItem);
		  });

	}

	dismiss(isTrue = false, message = "" , editedItem){
		this.dialogRef.close({isTrue , message , editedItem});
	  }

}
