// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { StatisticComponent } from './statistic.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
	imports: [
		NgxMaskModule.forRoot(),
		CommonModule,
		PartialsModule,
		CoreModule,
		RouterModule.forChild([
			{
				path: '',
				component: StatisticComponent
			},
		]),
	],
	providers: [],
	declarations: [
		StatisticComponent,
	]
})
export class StatisticModule {
}
