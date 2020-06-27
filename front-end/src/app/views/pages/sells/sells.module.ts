import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolService } from './../../../core/_services/tools.service';
import { invoicesService } from './../../../core/_services/invoices.service';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatAutocompleteModule, MatNativeDateModule, MatCardModule, MatChipsModule, MatProgressBarModule, MatProgressSpinnerModule, MatIconModule, MatSnackBarModule, MatSidenavModule, MatToolbarModule, MatDividerModule, MatStepperModule, MatTabsModule, MatListModule, MatTooltipModule, MatGridListModule, MatButtonToggleModule, MatBottomSheetModule, MatExpansionModule, MatMenuModule, MatTreeModule, MatDatepickerModule, MatSlideToggleModule, MatDialogModule, MatRippleModule } from '@angular/material';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { SellsComponent } from './sells.component';
import { ViewSellsComponent } from './view-sells/view-sells.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialPreviewModule } from '../../partials/content/general/material-preview/material-preview.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AllCustomersService } from '../../../core/_services/all-customers.service';
import { AllItemsService } from '../../../core/_services/all-Items.service';
import { NgxMaskModule } from 'ngx-mask';
import { AddItemComponent } from './add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';


@NgModule({
	imports: [
		NgxMaskModule.forRoot(),
		CommonModule,
		PartialsModule,
		CoreModule,
		NgSelectModule,
		RouterModule.forChild([
			{
				path: '',
				component: SellsComponent,
				children: [
					{
						path: '',
						redirectTo: 'view',
						pathMatch: 'full'
					},
					{
						path: 'view',
						component: ViewSellsComponent
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
		MatSnackBarModule


	],
	providers: [
		AllItemsService,
		ToolService,
		AllCustomersService,
		invoicesService,
	],
	entryComponents: [
		AddItemComponent,
		EditItemComponent
	],
	declarations: [
		AddItemComponent,
		EditItemComponent,
		SellsComponent,
		ViewSellsComponent,
	],

})
export class SellsModule {
}
