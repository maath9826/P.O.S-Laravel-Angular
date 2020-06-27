import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LayoutConfigService } from '../_base/layout';

@Injectable()
export class ChartService {
	private invoicesChartSource = new BehaviorSubject<any>({});
	currentInvoicesChart = this.invoicesChartSource.asObservable();

	private gainChartSource = new BehaviorSubject<any>({});
	currentGainChart = this.gainChartSource.asObservable();

	constructor(private layoutConfigService: LayoutConfigService) { }

	changeInvoicesChart(chart_data){
		this.invoicesChartSource.next(chart_data);
	}

	changeGainChart(chart_data){
		this.gainChartSource.next(chart_data);
	}

}
