// Angular
import { Component, OnInit } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
// Widgets model
import { LayoutConfigService, SparklineChartOptions } from '../../../core/_base/layout';
import { Widget4Data } from '../../partials/content/widgets/widget4/widget4.component';
import { Router } from '@angular/router';

@Component({
	selector: 'kt-items',
	templateUrl: './items.component.html',
	styleUrls: ['items.component.scss'],
})
export class ItemsComponent implements OnInit {

	constructor() {
	}

	ngOnInit(): void {
	}
}
