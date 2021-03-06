/** @format */

import { By } from 'selenium-webdriver';

import AsyncBaseContainer from '../async-base-container.js';

import * as driverHelper from '../driver-helper.js';

export default class WizardNavigationComponent extends AsyncBaseContainer {
	constructor( driver ) {
		super( driver, By.css( '.wizard__navigation-links' ) );
		driver.sleep( 1000 );
	}

	async goBack() {
		return await driverHelper.clickWhenClickable(
			this.driver,
			By.css( 'a.wizard__navigation-link .gridicons-arrow-left' )
		);
	}

	async skipStep( stepNumber ) {
		await driverHelper.waitTillPresentAndDisplayed(
			this.driver,
			By.css( `.wizard__progress-indicator[data-e2e-type="step-indicator-${ stepNumber }"]` )
		);
		return await driverHelper.clickWhenClickable(
			this.driver,
			By.css( 'a.wizard__navigation-link .gridicons-arrow-right' )
		);
	}
}
