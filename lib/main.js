class Bluetooth {
	constructor() {

	}

  /**
	  * Calls navigator.bluetooth.requestDevice
	  *
	  *	@param {Object} filters Collection of filters for devices
	  *
	  * @return {Object} Returns a new instance of Device
	  */
	acquire(filters) {
		const filterArr = [];
		// const optionalServices;

		if (filters) {

		}

	}
}

class Device {
	constructor(apiDevice) {

	}

	connect() {

	}

	disconnect() {

	}

};

module.exports = { Bluetooth };