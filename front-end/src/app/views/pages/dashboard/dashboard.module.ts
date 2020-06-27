// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DashboardComponent } from './dashboard.component';
import { CustomerService } from '../../../core/_services/customer.service';
import { ItemService } from '../../../core/_services/items.service';
import { StatusService } from '../../../core/_services/status.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartService } from '../../../core/_services/chart.service';
import {MatRadioModule} from '@angular/material/radio';
import { NgxMaskModule } from 'ngx-mask';






@NgModule({
	imports: [
		NgxMaskModule.forRoot(),
		CommonModule,
		PartialsModule,
		CoreModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule ,
		FormsModule,
		ReactiveFormsModule,
		MatRadioModule,
		RouterModule.forChild([
			{
				path: '',
				component: DashboardComponent
			},
		]),
	],
	providers: [
		CustomerService,
		ItemService,
		ChartService,
		StatusService,


	],
	declarations: [
		DashboardComponent,
	]
})
export class DashboardModule {
}
