import { Component, OnInit, Input , AfterViewInit, ViewChild, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatChipInputEvent, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { ItemService } from './../../../../core/_services/items.service';
import { invoicesService } from './../../../../core/_services/invoices.service';
import { CustomerService } from './../../../../core/_services/customer.service';


@Component({
	selector: 'kt-confirm-pay-debt',
	templateUrl: './confirm-pay-debt.component.html',
	styleUrls: ['./confirm-pay-debt.component.scss']
})
export class ConfirmPayDebtComponent implements OnInit {
	editedItem;
	public _form: FormGroup;

	constructor(
		public snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<ConfirmPayDebtComponent>,
		private itemService : ItemService ,
		private invoiceService : invoicesService ,
		private customerService: CustomerService,
		@Inject(MAT_DIALOG_DATA) public data: any
		) {}

	ngOnInit() {
		console.log(this.data.id);
	}

	onSubmit() {
			this.customerService.payDebt({customer_id : this.data.customer_id, payed_debt : this.data.payed_debt}).subscribe(res => {
				this.dismiss(true, "تم الاضافة");
			  });
	}

	dismiss(isTrue = false, message = ""){
		this.dialogRef.close({isTrue , message});
	  }

	closeDialog(){
		this.dialogRef.close();
	  }

	splitToDigit(N){
		return N.split('').map((i) => { return Number(i); })
	}
	transformNumberToString(){
		let number = this.data.payed_debt;
		let numberString = number.toString();
		let newNumber = number;
		let newNumberString = newNumber.toString();
		let a = [];
		let zeroToNineteen = ["","واحد","إثنان","ثلاثة","أربعة","خمسة","ستة","سبعة","ثمانية","تسعة","عشرة","أحد عشر","إثنا عشر","ثلاثة عشر","أربعة عشر","خمسة عشر","ستة عشر","سبعة عشر","ثمانية عشر","تسعة عشر"]
		let tens = ["","","عشرون","ثلاثون","أربعون","خمسون","ستون","سبعون","ثمانون","تسعون"]
		let hundereds = ["","مئة","مئتان","ثلاثمئة","أربعمئة","خمسمئة","ستمئة","سبعمئة","ثمانمئة","تسعمئة"]
		let thousands = ["","ألف","ألفان","ثلاثة آلاف","أربعة آلاف","خمسة آلاف","ستة آلاف","سبعة آلاف","ثمانية آلاف","تسعة آلاف"]
		let millions = ["","مليون","مليونان","ثلاثة ملايين","أربعة ملايين","خمسة ملايين","ستة ملايين","سبعة ملايين","ثمانية ملايين","تسعة ملايين"]
		let n : number;


		// if(number <= 19){
		// 	return zeroToNineteen[number];
		// }

		if(number <= 999999999){ //11321
			let numberLength = newNumberString.length;
			let firstTwoDigits = parseInt(this.splitToDigit(newNumberString).slice(0,2).join(""));
			let reversedNumberArray = this.splitToDigit(newNumberString).reverse();
			let tensIndex = null;
			for(let x=1; x <= numberLength; numberLength-=1){
				newNumberString = newNumber.toString();
				firstTwoDigits = parseInt(this.splitToDigit(newNumberString).slice(0,2).join(""));
				if(newNumber == 0){
					break;
				}
				else if(numberLength % 3 == 0){
					if(reversedNumberArray[numberLength-1] == 0){
						continue;
					}
					n = Math.floor(newNumber/Math.pow(10, numberLength - x)) ;
					if(numberLength == 9 && reversedNumberArray[numberLength-2] == 0 && reversedNumberArray[numberLength-3] == 0){
						a.push(hundereds[n] + " مليون ");
					}
					else if(numberLength == 6 && reversedNumberArray[numberLength-2] == 0 && reversedNumberArray[numberLength-3] == 0){
							a.push(hundereds[n] + " ألف ");
					}
					else{
						a.push(hundereds[n]);
					}
				}
				else if(numberLength % 3 == 2 && firstTwoDigits > 19){
					if(reversedNumberArray[numberLength-1] == 0){
						continue;
					}
					n = Math.floor(newNumber/Math.pow(10, numberLength - x)) ;
					if(numberLength == 8){
						tensIndex = a.push(tens[n] + " مليون ");
					}
					else if(numberLength == 5){
						tensIndex = a.push(tens[n] + " ألف ");
					}
					else{
						tensIndex = a.push(tens[n])
					}
				}
				else{

					if(numberLength % 3 == 2){
						n = firstTwoDigits;
						newNumber = (newNumber - n*Math.pow(10, numberLength - 2));
						if(numberLength == 8){
							if(n == 10){
								a.push(zeroToNineteen[n] + " ملايين ");
							}
							else{
								a.push(zeroToNineteen[n] + " مليون ");
							}
						}
						else if(numberLength == 5){
							if(n == 10){
								a.push(zeroToNineteen[n] + " آلاف ");
							}
							else{
								a.push(zeroToNineteen[n] + " ألف ");
							}
						}
						else{
							a.push(zeroToNineteen[n]);
						}
						numberLength-=1;
						continue;
					}
					else if(reversedNumberArray[numberLength-1] == 0){
						continue;
					}
					else{
						n = reversedNumberArray[numberLength-1];
					}
					if(tensIndex){
							a.splice(tensIndex - 1, 0, zeroToNineteen[n]);
					}
					else if(numberLength == 7) {
							a.push(millions[n]);
					}
					else if(numberLength == 4) {
							a.push(thousands[n]);
					}
					else{
						a.push(zeroToNineteen[n]);
					}
				}
				newNumber = (newNumber - n*Math.pow(10, numberLength - x));
			}
			return a.join(" و ");
		}
	}
}

