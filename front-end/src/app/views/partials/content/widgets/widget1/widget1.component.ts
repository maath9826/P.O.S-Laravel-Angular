// Angular
import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
import { ItemService } from '../../../../../core/_services/items.service';
// Imports



export interface Widget1Data {
	title: string;
	desc: string;
	value: string;
	valueClass?: string;
}

@Component({
	selector: 'kt-widget1',
	templateUrl: './widget1.component.html',
	styleUrls: ['./widget1.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Widget1Component implements OnInit {
	// Public properties
	// @Input() data: Widget1Data[];
	@Input() data;
	invoicesCount;
	income;
	debt;
	debtIgnorance;
	gain;
	itemsCount;
	constructor(private itemsService : ItemService,
				private ChangeDetectorRef: ChangeDetectorRef){}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		// this.itemsService.getWeekStatus({}).subscribe(res =>{
		// 	this.data = [
		// 		{
		// 			title: 'الفواتير',
		// 			desc: ' عدد الفواتير',
		// 			value: res['invoicesCount'],
		// 			valueClass: 'kt-font-info'
		// 		}, {
		// 			title: 'الدخل',
		// 			desc: 'مقدار الدخل',
		// 			value: res['income'],
		// 			valueClass: 'kt-font-warning'
		// 		},
		// 		{
		// 			title: 'الديون',
		// 			desc: 'مقدار الديون',
		// 			value: res['debt'],
		// 			valueClass: 'kt-font-danger'
		// 		},
		// 		{
		// 			title: 'الربح',
		// 			desc: 'مقدار الربح',
		// 			value: res['debtIgnorance'],
		// 			valueClass: 'kt-font-success'
		// 		},
		// 		{
		// 			title: 'الربح الكلي',
		// 			desc: 'مقدار الربح باهمال الدين',
		// 			value: res['gain'],
		// 			valueClass: 'kt-font-success'
		// 		},
		// 		{
		// 			title: 'المواد',
		// 			desc: 'المواد الجديدة التي تم اضافتها',
		// 			value: res['itemsCount'],
		// 			valueClass: 'kt-font-info'
		// 		},
		// 	];


		// 	this.ChangeDetectorRef.markForCheck();
		// })
		}



}
