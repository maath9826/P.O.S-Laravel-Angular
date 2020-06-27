// Angular
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// Charts
import { Chart } from 'chart.js/dist/Chart.min.js';
import { ChartService } from '../../../../../core/_services/chart.service';
import { StatusService } from '../../../../../core/_services/status.service';


@Component({
	selector: 'kt-daily-invoices-sell',
	templateUrl: './daily-invoices-sell.component.html',
	styleUrls: ['./daily-invoices-sell.component.scss'],
})
export class DailyInvoicesSell implements OnInit {
	// Public properties
	@Input() title: string;
	@Input() desc: string;
	chartData: { labels: string[]; datasets: any[] };
	chart_init;
	@ViewChild('chart', {static: true}) chart: ElementRef;



	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private layoutConfigService: LayoutConfigService,
				private chartService: ChartService,
				private statusService : StatusService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {




			this.chartService.currentInvoicesChart.subscribe(res =>{
				if(!this.chart_init){
					this.chart_init = new Chart(this.chart.nativeElement, {
						type: 'bar',
						data: res,
						options: {
							title: {
								display: false,
								text: 'Chart.js Bar Chart - Stacked'
							},
							tooltips: {
								mode: 'index',
								intersect: false,
								xPadding: 10,
								yPadding: 10,
								caretPadding: 10
							},
							legend: {
								display: false
							},
							responsive: true,
							maintainAspectRatio: false,
							barRadius: 4,
							scales: {
								xAxes: [{
									stacked: true,
								}],
								yAxes: [{
									stacked: true
								}]
							},
							layout: {
								padding: {
									left: 0,
									right: 0,
									top: 0,
									bottom: 0
								}
							}
						}
					});
				}else{
					this.chartData = res;
					this.chart_init.data = this.chartData;
					this.chart_init.update();
				}

			})





	}

	/** Init chart */
	initChartJS(data_of_chart) {
		// For more information about the chartjs, visit this link
		// https://www.chartjs.org/docs/latest/getting-started/usage.html

	}
}
