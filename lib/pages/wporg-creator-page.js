/** @format */
import { By } from 'selenium-webdriver';
import config from 'config';

import * as driverHelper from '../driver-helper';
import * as dataHelper from '../data-helper';
import AsyncBaseContainer from '../async-base-container';

const jurassicNinjaCreateURL = 'http://jurassic.ninja/create';

const TEMPLATES = {
	default: `${ jurassicNinjaCreateURL }?shortlived`,
	noJetpack: `${ jurassicNinjaCreateURL }?shortlived&nojetpack`,
	jetpackMaster: `${ jurassicNinjaCreateURL }?shortlived&jetpack-beta`,
	branch: `${ jurassicNinjaCreateURL }?shortlived&jetpack-beta`,
	wooCommerceNoJetpack: `${ jurassicNinjaCreateURL }?shortlived&nojetpack&woocommerce`,
};

const PASSWORD_ELEMENT = By.css( '#jurassic_password' );
const USERNAME_ELEMENT = By.css( '#jurassic_username' );
const URL_ELEMENT = By.css( '#jurassic_url' );
const CONTINUE_LINK = By.linkText( 'The new WP is ready to go, visit it!' );

export default class WporgCreatorPage extends AsyncBaseContainer {
	constructor( driver, url ) {
		super( driver, By.css( '#progress' ), url );
	}

	static async Visit( driver, url ) {
		// Randomly wait 1-10 sec before actually creating JN site.
		// It may prevent these "Service Unavailable" errors
		await driver.sleep( Math.floor( Math.random() * 10 + 1 ) * 1000 );
		const page = new this( driver, url );
		if ( ! page.url ) {
			throw new Error( `URL is required to visit the ${ page.name }` );
		}
		await page._visitInit();
		return page;
	}

	async _postInit() {
		await driverHelper.waitTillPresentAndDisplayed(
			this.driver,
			CONTINUE_LINK,
			this.explicitWaitMS * 20
		);
		return await driverHelper.clickWhenClickable( this.driver, CONTINUE_LINK );
	}

	async getPassword() {
		await driverHelper.waitTillPresentAndDisplayed( this.driver, PASSWORD_ELEMENT );
		return await this.driver.findElement( PASSWORD_ELEMENT ).getText();
	}

	async getUsername() {
		driverHelper.waitTillPresentAndDisplayed( this.driver, USERNAME_ELEMENT );
		return await this.driver.findElement( USERNAME_ELEMENT ).getText();
	}

	async getUrl() {
		await driverHelper.waitTillPresentAndDisplayed( this.driver, URL_ELEMENT );
		return await this.driver.findElement( URL_ELEMENT ).getText();
	}

	async waitForWpadmin() {
		await driverHelper.refreshIfJNError( this.driver );
		return await driverHelper.waitTillPresentAndDisplayed( this.driver, PASSWORD_ELEMENT );
	}

	static _getCreatorURL( template = 'default' ) {
		if ( ! TEMPLATES[ template ] ) {
			throw new Error( 'Incorrect WporgCreatorPage template specified.' );
		}

		let url = TEMPLATES[ template ];
		if ( dataHelper.isRunningOnJetpackBranch() ) {
			url += `&branch=${ config.get( 'jetpackBranchName' ) }`;
		}
		return url;
	}
}
