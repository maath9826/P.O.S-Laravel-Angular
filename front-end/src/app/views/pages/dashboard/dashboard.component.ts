// Angular
import { Component, OnInit, Input ,ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
// Widgets model
import { LayoutConfigService, SparklineChartOptions } from '../../../core/_base/layout';
import { Widget4Data } from '../../partials/content/widgets/widget4/widget4.component';
import { CustomerService } from '../../../core/_services/customer.service';
import { ItemService } from '../../../core/_services/items.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { timestamp } from 'rxjs/operators';
import { ChartService } from '../../../core/_services/chart.service';
import { StatusService } from '../../../core/_services/status.service';


@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
	allCustomers;
	inDebtCustomers = 0;
	notDebitedCustomers  = 0;
	allItems;
	lowQuantity = 0;
	highQuantity = 0;
	debt;
	dateOfSpecStat;
	selectedTimeInterval:string;

	@Input()matDatepicker: MatDatepicker<string>

	data = [
		{
			title: 'الفواتير',
			desc: ' عدد الفواتير',
			value: "0",
			valueClass: 'kt-font-info'
		}, {
			title: 'الدخل',
			desc: 'مقدار الدخل',
			value: "0",
			valueClass: 'kt-font-warning'
		},
		{
			title: 'الديون',
			desc: 'مقدار الديون',
			value: "0",
			valueClass: 'kt-font-danger'
		},
		// {
		// 	title: 'الربح',
		// 	desc: 'الربح ناقص الدين',
		// 	value: "",
		// 	valueClass: 'kt-font-success'
		// },
		// {
		// 	title: 'الربح',
		// 	desc: 'مقدار الربح',
		// 	value: "",
		// 	valueClass: 'kt-font-success'
		// },
		{
			title: 'المواد',
			desc: 'المواد الجديدة التي تم اضافتها',
			value: "0",
			valueClass: 'kt-font-info'
		},
	];
	timeIntervals = ['اسبوع', 'شهر', 'سنة']

	startDate = new FormControl();
	endDate = new FormControl();
	constructor(private customerService: CustomerService,
				private itemService: ItemService,
				private ChangeDetectorRef: ChangeDetectorRef,
				private layoutConfigService: LayoutConfigService,
				private chartService: ChartService,
				private statusService: StatusService) {
	}

	ngOnInit() {
		this.statusService.getSpecificStatus({}).subscribe(res =>{
			// // this.data = [
			// // 	{
			// // 		title: 'الفواتير',
			// // 		desc: ' عدد الفواتير',
			// // 		value: res['invoicesCount'],
			// // 		valueClass: 'kt-font-info'
			// // 	}, {
			// // 		title: 'الدخل',
			// // 		desc: 'مقدار الدخل',
			// // 		value: res['income'],
			// // 		valueClass: 'kt-font-warning'
			// // 	},
			// // 	{
			// // 		title: 'الديون',
			// // 		desc: 'مقدار الديون',
			// // 		value: res['debt'],
			// // 		valueClass: 'kt-font-danger'
			// // 	},
			// // 	// {
			// // 	// 	title: 'الربح',
			// // 	// 	desc: 'الربح ناقص الدين',
			// // 	// 	value: res['debtIgnorance'],
			// // 	// 	valueClass: 'kt-font-success'
			// // 	// },
			// // 	// {
			// // 	// 	title: 'الربح',
			// // 	// 	desc: 'مقدار الربح',
			// // 	// 	value: res['gain'],
			// // 	// 	valueClass: 'kt-font-success'
			// // 	// },
			// // 	{
			// // 		title: 'المواد',
			// // 		desc: 'المواد الجديدة التي تم اضافتها',
			// // 		value: res['itemsCount'],
			// // 		valueClass: 'kt-font-info'
			// // 	},
			// ];
			// this.chartService.currentChart.subscribe(res =>{})
			this.statusService.getChartStatus({interval : this.selectedTimeInterval}).subscribe(res=>{
				this.newInvoicesChart({
					labels: ['يوم 1', 'يوم 2', 'يوم 3', 'يوم 4', 'يوم 5', 'يوم 6', 'يوم 7'],
					datasets: [
						{
							backgroundColor: this.layoutConfigService.getConfig('colors.state.primary'),
							data: res['invoicesChartData']
						}
					]
				})
				this.newGainChart({
					labels: ['يوم 1', 'يوم 2', 'يوم 3', 'يوم 4', 'يوم 5', 'يوم 6', 'يوم 7'],
					datasets: [
						{
							backgroundColor: this.layoutConfigService.getConfig('colors.state.success'),
							data: res['gainChartData']
						}
					]
				})
			})


			this.ChangeDetectorRef.markForCheck();
		})
		this.customerService.getCustomers({}).subscribe(res =>{
			this.allCustomers = res['count'];
			res['customers'].forEach(element => {
				if(element.credit != 0){
					this.inDebtCustomers += 1
				}else{
					this.notDebitedCustomers += 1
				}
			});

		})

		this.itemService.getItems({}).subscribe(res =>{
			this.allItems = res['count'];
			res['items'].forEach(element => {
				if(element.quantity <= 50 && element.quantity != -1){
					this.lowQuantity += 1
				}else{
					this.highQuantity += 1
				}
			});

		})

		this.statusService.getSpecificStatus({}).subscribe(res =>{
			this.debt = res['allTimeDebt'];
		})


		setTimeout(()=>{
			this.ChangeDetectorRef.markForCheck();
		},2000)

		this.selectedTimeInterval = 'اسبوع';
	};

	showPicker(){
		let start_date = this.convert(this.startDate.value),
		end_date = this.convert(this.endDate.value);
		if(start_date > end_date){
			return alert("تاريخ البدأ يجب ان يكون اصغر تاريخ الانتهاء , الرجاْ التأكد من المدخلات")
		}else if(start_date < end_date){
			this.statusService.getSpecificStatus({startDate : start_date ,endDate : end_date}).subscribe(res =>{
				this.data = [
					{
						title: 'الفواتير',
						desc: ' عدد الفواتير',
						value: res['invoicesCount'],
						valueClass: 'kt-font-info'
					}, {
						title: 'الدخل',
						desc: 'مقدار الدخل',
						value: res['income'],
						valueClass: 'kt-font-warning'
					},
					{
						title: 'الديون',
						desc: 'مقدار الديون',
						value: res['debt'],
						valueClass: 'kt-font-danger'
					},
					// {
					// 	title: 'الربح',
					// 	desc: 'الربح ناقص الدين',
					// 	value: res['debtIgnorance'],
					// 	valueClass: 'kt-font-success'
					// },
					// {
					// 	title: 'الربح',
					// 	desc: 'مقدار الربح',
					// 	value: res['gain'],
					// 	valueClass: 'kt-font-success'
					// },
					{
						title: 'المواد',
						desc: 'المواد الجديدة التي تم اضافتها',
						value: res['itemsCount'],
						valueClass: 'kt-font-info'
					},
				];


				this.ChangeDetectorRef.markForCheck();
			})
		}else if(start_date == end_date){
			return alert("تاريخ البدأ يجب ان يكون اصغر تاريخ الانتهاء , الرجاْ التأكد من المدخلات")
		}else{
			return null;
		}
	}
	 convert(str) {
		if(str){
			var date = new Date(str),
			mnth = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2);
		  return [date.getFullYear(), mnth, day].join("-");
		}else{
			return null
		}
	  }

	  newInvoicesChart(chart_data){
		  this.chartService.changeInvoicesChart(chart_data)
	  }
	  newGainChart(chart_data){
		  this.chartService.changeGainChart(chart_data)
	  }



	  updateChart(){
		if(this.selectedTimeInterval == 'اسبوع'){
			this.statusService.getChartStatus({interval : this.selectedTimeInterval}).subscribe(res=>{
				this.newInvoicesChart({
					labels: ['يوم 1', 'يوم 2', 'يوم 3', 'يوم 4', 'يوم 5', 'يوم 6', 'يوم 7'],
					datasets: [
						{
							backgroundColor: this.layoutConfigService.getConfig('colors.state.primary'),
							data: res['invoicesChartData']
						}
					]
				})
				this.newGainChart({
					labels: ['يوم 1', 'يوم 2', 'يوم 3', 'يوم 4', 'يوم 5', 'يوم 6', 'يوم 7'],
					datasets: [
						{
							backgroundColor: this.layoutConfigService.getConfig('colors.state.success'),
							data: res['gainChartData']
						}
					]
				})
			})
		}else if(this.selectedTimeInterval == 'شهر'){
			this.statusService.getChartStatus({interval : this.selectedTimeInterval}).subscribe(res=>{
				this.newInvoicesChart({
					labels: ['اسبوع 1', 'اسبوع 2', 'اسبوع 3', 'اسبوع 4'],
					datasets: [
						{
							backgroundColor: this.layoutConfigService.getConfig('colors.state.primary'),
							data: res['invoicesChartData']
						}
					]
				})
				this.newGainChart({
					labels: ['اسبوع 1', 'اسبوع 2', 'اسبوع 3', 'اسبوع 4'],
					datasets: [
						{
							backgroundColor: this.layoutConfigService.getConfig('colors.state.primary'),
							data: res['gainChartData']
						}
					]
				})
			})
		}else{
			this.statusService.getChartStatus({interval : this.selectedTimeInterval}).subscribe(res=>{
				this.newInvoicesChart({
					labels: ['شهر 1','شهر 2','شهر 3','شهر 4' ,'5 شهر' ,'6 شهر' ,'7 شهر', '8 شهر', '9 شهر', '10 شهر', '11 شهر', '12 شهر'],
					datasets: [
						{
							backgroundColor: this.layoutConfigService.getConfig('colors.state.primary'),
							data: res['invoicesChartData']
						}
					]
				})
				this.newGainChart({
					labels: ['شهر 1','شهر 2','شهر 3','شهر 4' ,'5 شهر' ,'6 شهر' ,'7 شهر', '8 شهر', '9 شهر', '10 شهر', '11 شهر', '12 شهر'],
					datasets: [
						{
							backgroundColor: this.layoutConfigService.getConfig('colors.state.primary'),
							data: res['gainChartData']
						}
					]
				})
			})
		}

	  }



}
