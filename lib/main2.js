// const errorHandler = require('./errorHandler');
const Bluetooth = {
	gattCharacteristicsMapping: {
		// battery_level characteristic
		battery_level: {
			primaryServices: ['battery_service'],
			includedProperties: ['read', 'notify']
		},
		// sensor_location characteristic
		sensor_location: {
			primaryServices: ['heart_rate'],
			includedProperties: ['read'],
			parseValue: value => {
				switch (value) {
					case 0: return 'Other';
					case 1: return 'Chest';
					case 2: return 'Wrist';
					case 3: return 'Finger';
					case 4: return 'Hand';
					case 5: return 'Ear Lobe';
					case 6: return 'Foot';
					default: return 'Unknown';
				}
			}
		}
	},
  /**
	  * Calls navigator.bluetooth.requestDevice
	  *
	  *	@param {Object} filters Collection of filters for devices
	  *					all filters are optional, but at least 1 is required
	  *					.name {string}
	  *					.namePrefix {string}
	  *					.uuid {string}
	  *					.services {array}
	  *					.optionalServices {array} - defaults to all available services,
	  *							use an empty array to get no optional services
	  *
	  * @return {Object} Returns a new instance of Device
	  *
	  */
	acquire(filters) {

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/; // TODO: Add error for invalid U
		const requestParams = {
			filters: [],
		};

		if (filters) {
			if (filters.name) requestParams.filters.push({ name: filters.name });
			if (filters.namePrefix) requestParams.filters.push({ namePrefix: filters.namePrefix });
			if (filters.uuid) requestParams.filters.push({ uuid: filters.uuid });
			if (filters.services) requestParams.filters.push({ services: filters.services });
			if (filters.optionalServices) requestParams.optionalServices = filters.optionalServices;
			else requestParams.optionalServices = this.gattServiceList;
		} else {
			/*
			* If no filters are passed in, throw error no_filters
			*	TODO: Catch error for "user canceled request device chooser"
			*					and "bluetooth not available"
			*/
			// errorHandler('no_filters'/*, Context Object */);
		}

		return new Device(navigator.bluetooth.requestDevice(requestParams));
	}

}

class Device {
	constructor(apiDevice) {
		this.apiDevice = apiDevice;
		this.apiServer = null;
		this.connected = this.checkConnectionStatus();
	}

	/**
		* checks apiDevice to see whether device is connected
		*/
	checkConnectionStatus() {
		return this.apiDevice.gatt.connected;
	}

	/**
		* Establishes a new GATT connection w/ the device
		* 	and stores the return of the promise as this.apiServer
		*
		* FIXME: Does this.apiServer need to be a promise?
		*		If so, set it to the promise returned by .gatt.connect(),
		*		instead of setting it to the resolution in the .then callback.
	  */
	connect() {
		this.apiDevice.gatt.connect()
		.then(server => {
			this.apiServer = server;
		});
		// TODO: Add error functionality
	}

	/**
	 * Attempts to disconnect from BT device
	 *
	 * @Return {Boolean} successfully disconnected
	 *					returns false after 3ms
	 */
	disconnect() {
		return new Promise((resolve, reject) => {

			// If not disconnected within 1 second, reject promise
			setTimeout(() => {
				if (this.connected) {
					// errorHandler('disconnect_timeout', {});
					return reject(false);	// TODO: does this cause an error if already resolved?
				} else {
					this.apiServer = null;
					return resolve(true);
				}
			}, 1000);

			/**
			 * If the device is connected, attempt to disconnect
			 * then immediately check if successful and resolve promise
			 */
			if (this.connected) {
				this.apiDevice.gatt.disconnect()
				.then(() => {
					if (!this.connected) {
						this.apiServer = null;
						return resolve(true);
					};
				})
				.catch(err => {
					// errorHandler('disconnect_error', {}, err);
				});
			}
		});
	}

	/**
	 * Attempts to get characteristic value from BT device
	 *
	 * @param {string} GATT characteristic name
	 * @return {Promise} A promise to the characteristic value
	 *					returns false after 3ms
	 */
	getValue(characteristicName) {
		// TODO: add error handling for absent characteristics and characteristic properties
		var characteristicObj = Bluetooth.gattCharacteristicsMapping[characteristicName];
		if (characteristicObj.includedProperties.includes('read')){
			/**
			 * TODO: add functionality to map through all primary services
			 *       to characteristic, if multiple exist e.g. 'sensor_location'...
			 *       or add functionality at device connection to filter primary
			 *       services based on only those available to device
			 */
			this.apiServer.getPrimaryService(characteristicObj.primaryServices[0])
			.then(service => {
				return service.getCharacteristic(characteristicName);
			})
			.then(characteristic => {
				return characteristic.readValue();
			})
			.then(value => {
				if (!characteristicObj.parseValue) return value.getUint8(0)
				return characteristicObj.parseValue(value.getUint8(0));
			})
			.catch(err => {
				// errorHandler('disconnect_error', {}, err);
			})
		}
		else {
			// errorHandler('illegal action', {}, err);
		}
	} // end getValue

};
