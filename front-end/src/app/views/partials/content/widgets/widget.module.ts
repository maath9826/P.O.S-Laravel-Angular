import { DailyIncome } from './daily-income/daily-income.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule, } from '@angular/material';
import { CoreModule } from '../../../../core/core.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// Datatable
import { DataTableComponent } from './general/data-table/data-table.component';
// General widgets
import { Widget1Component } from './widget1/widget1.component';
import { Widget4Component } from './widget4/widget4.component';
import { Widget5Component } from './widget5/widget5.component';
import { Widget12Component } from './widget12/widget12.component';
import { Widget14Component } from './widget14/widget14.component';
import { Widget26Component } from './widget26/widget26.component';
import { Timeline2Component } from './timeline2/timeline2.component';
import { DailyInvoicesSell } from './daily-invoices-sell copy/daily-invoices-sell.component';
import { ItemService } from '../../../../core/_services/items.service';
import { ToolService } from '../../../../core/_services/tools.service';
import { ChartService } from '../../../../core/_services/chart.service';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
	declarations: [
		DataTableComponent,
		// Widgets
		Widget1Component,
		Widget4Component,
		Widget5Component,
		Widget12Component,
		Widget14Component,
		DailyInvoicesSell,
		DailyIncome,
		Widget26Component,
		Timeline2Component,
	],
	exports: [
		DataTableComponent,
		// Widgets
		Widget1Component,
		Widget4Component,
		Widget5Component,
		Widget12Component,
		Widget14Component,
		DailyInvoicesSell,
		DailyIncome,

		Widget26Component,
		Timeline2Component,
	],
	imports: [
		NgxMaskModule.forRoot(),
		CommonModule,
		PerfectScrollbarModule,
		MatTableModule,
		CoreModule,
		MatIconModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		MatSortModule,
	],
	providers: [
		ItemService,
		ToolService,
		ChartService
	],

})
export class WidgetModule {
}
