import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolService } from './../../../core/_services/tools.service';
import { CustomerService } from './../../../core/_services/customer.service';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatAutocompleteModule, MatNativeDateModule, MatCardModule, MatChipsModule, MatProgressBarModule, MatProgressSpinnerModule, MatIconModule, MatSnackBarModule, MatSidenavModule, MatToolbarModule, MatDividerModule, MatStepperModule, MatTabsModule, MatListModule, MatTooltipModule, MatGridListModule, MatButtonToggleModule, MatBottomSheetModule, MatExpansionModule, MatMenuModule, MatTreeModule, MatDatepickerModule, MatSlideToggleModule, MatDialogModule, MatRippleModule } from '@angular/material';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { CustomersComponent } from './customers.component';
import { ViewCustomersComponent } from './view-customers/view-customers.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddCustomersComponent } from './add-customers/add-customers.component';
// import { EditItemComponent } from './edit-customers/edit-customers.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialPreviewModule } from '../../partials/content/general/material-preview/material-preview.module';
import { EditCustomersComponent } from './edit-customers/edit-customers.component';
import { PayDebtComponent } from './pay-debt/pay-debt.component';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ConfirmAddInvoiceComponent } from './confirm-add-invoice/confirm-add-invoice.component';
import { ConfirmPayDebtComponent } from './confirm-pay-debt/confirm-pay-debt.component';


@NgModule({
	imports: [
		NgxMaskModule.forRoot(),
		CommonModule,
		PartialsModule,
		CoreModule,
		RouterModule.forChild([
			{
				path: '',
				component: CustomersComponent,
				children: [
					{
						path: '',
						redirectTo: 'view',
						pathMatch: 'full'
					},
					{
						path: 'view',
						component: ViewCustomersComponent
					},
				]
			},
		]),
		MatInputModule,
		MatFormFieldModule,
		MatDatepickerModule,
		MatAutocompleteModule,
		MatListModule,
		MatSliderModule,
		MatCardModule,
		MatSelectModule,
		MatButtonModule,
		MatIconModule,
		MatNativeDateModule,
		MatSlideToggleModule,
		MatCheckboxModule,
		MatMenuModule,
		MatTabsModule,
		MatTooltipModule,
		MatSidenavModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatTableModule,
		MatGridListModule,
		MatToolbarModule,
		MatBottomSheetModule,
		MatExpansionModule,
		MatDividerModule,
		MatSortModule,
		MatStepperModule,
		MatChipsModule,
		MatPaginatorModule,
		MatDialogModule,
		MatRippleModule,
		MatRadioModule,
		MatTreeModule,
		MatButtonToggleModule,
		MaterialPreviewModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModalModule


	],
	providers: [
		CustomerService,
		ToolService
	],
	entryComponents: [
		AddCustomersComponent,
		EditCustomersComponent,
		PayDebtComponent,
		AddInvoiceComponent,
		ConfirmAddInvoiceComponent,
		ConfirmPayDebtComponent
	],
	declarations: [
		CustomersComponent,
		ViewCustomersComponent,
		AddCustomersComponent,
		EditCustomersComponent,
		EditCustomersComponent,
		PayDebtComponent,
		AddInvoiceComponent,
		ConfirmAddInvoiceComponent,
		ConfirmPayDebtComponent,
	],

})
export class CustomersModule {
}
