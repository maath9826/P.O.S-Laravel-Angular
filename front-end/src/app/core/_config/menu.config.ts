export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [



			]
		},
		aside: {
			self: {},
			items: [
				{
					title: 'البيع',
					root: true,
					icon: 'flaticon-cart',
					page: '/sell',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},
				{section: 'المراجعة'},
				{
					title: 'المواد',
					root: true,
					icon: 'flaticon-tool',
					page: '/items',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},
				{
					title: 'الزبائن',
					root: true,
					icon: 'flaticon-customer',
					page: '/customers',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},
				{
					title: 'الفواتير',
					root: true,
					icon: 'flaticon-menu-button',
					page: '/invoices',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},
				{section: 'الادارة'},

				{
					title: 'الاحصائيات',
					root: true,
					icon: 'flaticon-diagram',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},
				{
					title: 'التقارير',
					root: true,
					icon: 'flaticon-folder-1',
					page: '/reports',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},


			]
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
