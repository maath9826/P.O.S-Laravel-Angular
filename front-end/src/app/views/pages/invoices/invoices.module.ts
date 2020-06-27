import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolService } from './../../../core/_services/tools.service';
import { ItemService } from './../../../core/_services/items.service';
import { AllCustomersService } from './../../../core/_services/all-customers.service';
import { AddInvoicesComponent } from './add-invoices/add-invoices.component';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatAutocompleteModule, MatNativeDateModule, MatCardModule, MatChipsModule, MatProgressBarModule, MatProgressSpinnerModule, MatIconModule, MatSnackBarModule, MatSidenavModule, MatToolbarModule, MatDividerModule, MatStepperModule, MatTabsModule, MatListModule, MatTooltipModule, MatGridListModule, MatButtonToggleModule, MatBottomSheetModule, MatExpansionModule, MatMenuModule, MatTreeModule, MatDatepickerModule, MatSlideToggleModule, MatDialogModule, MatRippleModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { InvoicesComponent } from './Invoices.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialPreviewModule } from '../../partials/content/general/material-preview/material-preview.module';
import { ViewInvoicesComponent } from './view-invoices/view-invoices.component';
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
				component: InvoicesComponent,
				children: [
					{
						path: '',
						redirectTo: 'view',
						pathMatch: 'full'
					},
					{
						path: 'view',
						component: ViewInvoicesComponent
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
		NgbModalModule,
		MatSnackBarModule,
		NgSelectModule


	],
	providers: [
		ItemService,
		ToolService,
		AllCustomersService
	],
	entryComponents: [
		AddInvoicesComponent,
		// EditItemComponent,
	],
	declarations: [
		InvoicesComponent,
		AddInvoicesComponent,
		ViewInvoicesComponent
		// EditItemComponent,
	],

})
export class InvoicesModule {
}
