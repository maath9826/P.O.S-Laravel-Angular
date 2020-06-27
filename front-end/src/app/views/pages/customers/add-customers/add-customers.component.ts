import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatChipInputEvent, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { CustomerService } from './../../../../core/_services/customer.service';

@Component({
	selector: 'kt-add-customers',
	templateUrl: './add-customers.component.html',
	styleUrls: ['./add-customers.component.scss']
})
export class AddCustomersComponent implements OnInit {

	public _form: FormGroup;
  startDate = new Date(1990, 0, 1);
	date = new FormControl(new Date());

	serializedDate = new FormControl((new Date()).toISOString());
	minDate = new Date(2011, 0, 1);
	maxDate = new Date(2018, 11, 1);


  stateCtrl: FormControl;
	filteredStates: Observable<any[]>;
	states: any[] = [
		{
			name: 'Arkansas',
			population: '2.978M',
			// https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
			flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
		},
		{
			name: 'California',
			population: '39.14M',
			// https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
			flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
		},
		{
			name: 'Florida',
			population: '20.27M',
			// https://commons.wikimedia.org/wiki/File:Flag_of_Florida.svg
			flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
		},
		{
			name: 'Texas',
			population: '27.47M',
			// https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
			flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'
		}
	];
	foods = [
		{ value: 'steak-0', viewValue: 'Steak' },
		{ value: 'pizza-1', viewValue: 'Pizza' },
		{ value: 'tacos-2', viewValue: 'Tacos' }
  ];
  toppingList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

	isHuman = true;
	isHuman2 = true;
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;

	// Enter, comma
	separatorKeysCodes = [ENTER, COMMA];

	fruits = [
		{ name: 'Pizza' },
		{ name: 'Steak' },
		{ name: 'Tacos' },
	];


	onChange(value) {
		this.isHuman = value.checked === true;
	}

	onChange2(value) {
		this.isHuman2 = value.checked === true;
	}

	filterStates(name: string) {
		return this.states.filter(state =>
			state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
	}

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// Add our fruit
		if ((value || '').trim()) {
			this.fruits.push({ name: value.trim() });
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}
	}

	remove(fruit: any): void {
		const index = this.fruits.indexOf(fruit);
		if (index >= 0) {
			this.fruits.splice(index, 1);
		}
	}


	constructor(
		public snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<AddCustomersComponent>,
		private customerService : CustomerService ,
		) {
			this.stateCtrl = new FormControl();
			this.filteredStates = this.stateCtrl.valueChanges
			.pipe(
				startWith(''),
				map(state => state ? this.filterStates(state) : this.states.slice())
				);
			}
			ngOnInit() {
				this.buildForm();
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
					phone: new FormControl('', [
						Validators.required,
						CustomValidators.number
					]),
					// credit: new FormControl('', [
					// 	Validators.required,
					// 	CustomValidators.number
					// ]),


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
		this.customerService.addCustomers(this._form.value).subscribe(res => {
			this.dismiss(true, "تم الاضافة بنجاح");
		  });

	}

	dismiss(isTrue = false, message = ""){
		this.dialogRef.close({isTrue , message});
	  }
}

