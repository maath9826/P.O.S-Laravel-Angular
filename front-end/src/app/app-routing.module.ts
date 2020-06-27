import { ItemsModule } from './views/pages/items/items.module';

import { StatisticModule } from './views/pages/statistic/statistic.module';
// Angular
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Components
import {BaseComponent} from './views/theme/base/base.component';
import {ErrorPageComponent} from './views/theme/content/error-page/error-page.component';
// Auth

const routes: Routes = [
	{
		path: '',
		component: BaseComponent,
		canActivate: [],
		children: [

			{
				path: 'statistic',
				loadChildren: () => import('./views/pages/statistic/statistic.module').then(m => m.StatisticModule),
			},




			{
				path: 'items',
				loadChildren: () => import('./views/pages/items/items.module').then(m => m.ItemsModule),
			},

			{
				path: 'customers',
				loadChildren: () => import('./views/pages/customers/customers.module').then(m => m.CustomersModule),
			},

			{
				path: 'invoices',
				loadChildren: () => import('./views/pages/invoices/invoices.module').then(m => m.InvoicesModule),
			},

			{
				path: 'sell',
				loadChildren: () => import('./views/pages/sells/sells.module').then(m => m.SellsModule),
			},


			{
				path: 'dashboard',
				loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
			},

			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					type: 'error-v6',
					code: 403,
					title: '403... Access forbidden',
					desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator',
				},
			},
			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'dashboard', pathMatch: 'full'},
			{path: '**', redirectTo: 'dashboard', pathMatch: 'full'},
		],
	},

	{path: '**', redirectTo: 'error/403', pathMatch: 'full'},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {
}
