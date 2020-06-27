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
	selector: 'kt-delete-item',
	templateUrl: './delete-item.component.html',
	styleUrls: ['./delete-item.component.scss']
})
export class DeleteItemComponent implements OnInit {
	editedItem;
	public _form: FormGroup;

	constructor(
		public snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<DeleteItemComponent>,
		private itemService : ItemService ,
		@Inject(MAT_DIALOG_DATA) public data: any
		) {}
			ngOnInit() {
				console.log(this.data.id);
			}
	onSubmit() {
		// console.log
		this.itemService.deleteItem({item_id:this.data.id}).subscribe(res => {
			this.dismiss(true, "تم الحذف بنجاح" , this.editedItem);
		  });

	}

	dismiss(isTrue = false, message = "" , editedItem){
		this.dialogRef.close({isTrue , message , editedItem});
	  }

	closeDialog(){
		this.dialogRef.close();
	  }

}
