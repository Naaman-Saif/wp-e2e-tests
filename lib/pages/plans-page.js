/** @format */

import webdriver from 'selenium-webdriver';
import AsyncBaseContainer from '../async-base-container';
import * as driverHelper from '../driver-helper';
import * as dataHelper from '../data-helper';

const by = webdriver.By;
const host = dataHelper.getJetpackHost();

export default class PlansPage extends AsyncBaseContainer {
	constructor( driver ) {
		super( driver, by.css( '.is-section-plans' ) );
	}

	async openPlansTab() {
		await driverHelper.ensureMobileMenuOpen( this.driver );
		const selector = by.css(
			'.current-plan a[href*="plans"]:not([href*="my-plan"]).section-nav-tab__link'
		);
		return await driverHelper.clickWhenClickable( this.driver, selector );
	}

	async waitForComparison() {
		return await driverHelper.waitTillPresentAndDisplayed(
			this.driver,
			by.css( '.plans-features-main__group' )
		);
	}

	async returnFromComparison() {
		return await driverHelper.clickWhenClickable( this.driver, by.css( '.header-cake__back' ) );
	}

	async confirmCurrentPlan( planName ) {
		let selector = by.css( `.is-current.is-${ planName }-plan` );
		if ( host !== 'WPCOM' ) {
			selector = by.css( `.is-${ planName }-plan` );
		}

		return await driverHelper.isEventuallyPresentAndDisplayed( this.driver, selector );
	}

	async planTypesShown( planType ) {
		return await driverHelper.isEventuallyPresentAndDisplayed(
			this.driver,
			by.css( `[data-e2e-plans="${ planType }"]` )
		);
	}
}
