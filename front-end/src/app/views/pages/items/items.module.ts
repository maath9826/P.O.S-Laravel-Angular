import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolService } from './../../../core/_services/tools.service';
import { ItemService } from './../../../core/_services/items.service';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatAutocompleteModule, MatNativeDateModule, MatCardModule, MatChipsModule, MatProgressBarModule, MatProgressSpinnerModule, MatIconModule, MatSnackBarModule, MatSidenavModule, MatToolbarModule, MatDividerModule, MatStepperModule, MatTabsModule, MatListModule, MatTooltipModule, MatGridListModule, MatButtonToggleModule, MatBottomSheetModule, MatExpansionModule, MatMenuModule, MatTreeModule, MatDatepickerModule, MatSlideToggleModule, MatDialogModule, MatRippleModule } from '@angular/material';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { ItemsComponent } from './items.component';
import { ViewItemsComponent } from './view-items/view-items.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddItemComponent } from './add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialPreviewModule } from '../../partials/content/general/material-preview/material-preview.module';
import { DeleteItemComponent } from './delete-item/delete-item.component';
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
				component: ItemsComponent,
				children: [
					{
						path: '',
						redirectTo: 'view',
						pathMatch: 'full'
					},
					{
						path: 'view',
						component: ViewItemsComponent
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
		ItemService,
		ToolService
	],
	entryComponents: [
		AddItemComponent,
		EditItemComponent,
		DeleteItemComponent,
	],
	declarations: [
		ItemsComponent,
		ViewItemsComponent,
		AddItemComponent,
		EditItemComponent,
		DeleteItemComponent,
	],

})
export class ItemsModule {
}
