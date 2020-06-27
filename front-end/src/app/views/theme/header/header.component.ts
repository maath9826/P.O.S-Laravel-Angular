// Angular
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
	NavigationCancel,
	NavigationEnd,
	NavigationStart,
	RouteConfigLoadEnd,
	RouteConfigLoadStart,
	Router
} from '@angular/router';
// Object-Path
import * as objectPath from 'object-path';
// Loading bar
import { LoadingBarService } from '@ngx-loading-bar/core';
// Layout
import { LayoutConfigService, LayoutRefService } from '../../../core/_base/layout';
// HTML Class Service
import { HtmlClassService } from '../html-class.service';


@Component({
	selector: 'kt-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
	// Public properties
	menuHeaderDisplay: boolean;
	fluid: boolean;
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;

	data : any[] = [
		{
			text: 'Documents',
			type: 0
		}, {
			icon: '<i class="flaticon-interface-3 kt-font-warning">',
			text: 'Annual finance report',
			type: 1
		}, {
			icon: '<i class="flaticon-share kt-font-success"></i>',
			text: 'Company meeting schedule',
			type: 1
		}, {
			icon: '<i class="flaticon-paper-plane kt-font-info"></i>',
			text: 'Project quotations',
			type: 1
		}, {
			text: 'Customers',
			type: 0
		}, {
			img: '<img src="assets/media/users/user1.jpg" alt="">',
			text: 'Amanda Anderson',
			type: 1
		}, {
			img: '<img src="assets/media/users/user2.jpg" alt="">',
			text: 'Kennedy Lloyd',
			type: 1
		}, {
			img: '<img src="assets/media/users/user3.jpg" alt="">',
			text: 'Megan Weldon',
			type: 1
		}, {
			img: '<img src="assets/media/users/user4.jpg" alt="">',
			text: 'Marc-André ter Stegen',
			type: 1
		}, {
			text: 'Files',
			type: 0
		}, {
			icon: '<i class="flaticon-lifebuoy kt-font-warning"></i>',
			text: 'Revenue report',
			type: 1
		}, {
			icon: '<i class="flaticon-coins kt-font-primary"></i>',
			text: 'Anual finance report',
			type: 1
		}, {
			icon: '<i class="flaticon-calendar kt-font-danger"></i>',
			text: 'Tax calculations',
			type: 1
		}
	];

	@ViewChild('ktHeader', {static: true}) ktHeader: ElementRef;

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param layoutRefService: LayoutRefService
	 * @param layoutConfigService: LayoutConfigService
	 * @param loader: LoadingBarService
	 * @param htmlClassService: HtmlClassService
	 */
	constructor(
		private router: Router,
		private layoutRefService: LayoutRefService,
		private layoutConfigService: LayoutConfigService,
		public loader: LoadingBarService,
		public htmlClassService: HtmlClassService
	) {
		// page progress bar percentage
		this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				// set page progress bar loading to start on NavigationStart event router
				this.loader.start();
			}
			if (event instanceof RouteConfigLoadStart) {
				this.loader.increment(35);
			}
			if (event instanceof RouteConfigLoadEnd) {
				this.loader.increment(75);
			}
			if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
				// set page progress bar loading to end on NavigationEnd event router
				this.loader.complete();
			}
		});
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		const config = this.layoutConfigService.getConfig();

		// get menu header display option
		this.menuHeaderDisplay = objectPath.get(config, 'header.menu.self.display');

		// header width fluid
		this.fluid = objectPath.get(config, 'header.self.width') === 'fluid';

		// animate the header minimize the height on scroll down. to be removed, not applicable for default demo
		/*if (objectPath.get(config, 'header.self.fixed.desktop.enabled') || objectPath.get(config, 'header.self.fixed.desktop')) {
			// header minimize on scroll down
			this.ktHeader.nativeElement.setAttribute('data-ktheader-minimize', '1');
		}*/
	}

	ngAfterViewInit(): void {
		// keep header element in the service
		this.layoutRefService.addElement('header', this.ktHeader.nativeElement);
	}

	search(e) {
	
	
	}
}
