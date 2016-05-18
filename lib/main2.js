// const errorHandler = require('./errorHandler');
const Bluetooth = {
	gattCharacteristicsMapping: {
		// battery_level characteristic
		battery_level: {
			primaryServices: ['battery_service'],
			includedProperties: ['read', 'notify']
		},
		// body_sensor_location characteristic
		body_sensor_location: {
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
	// all adopted services... passed in as argument to optional services filter
	gattServiceList: ['alert_notification', 'automation_io', 'battery_service', 'blood_pressure',
      'body_composition', 'bond_management', 'continuous_glucose_monitoring',
      'current_time', 'cycling_power', 'cycling_speed_and_cadence', 'device_information',
      'environmental_sensing', 'generic_access', 'generic_attribute', 'glucose',
      'health_thermometer', 'heart_rate', 'human_interface_device',
      'immediate_alert', 'indoor_positioning', 'internet_protocol_support', 'link_loss',
      'location_and_navigation', 'next_dst_change', 'phone_alert_status',
      'pulse_oximeter', 'reference_time_update', 'running_speed_and_cadence',
      'scan_parameters', 'tx_power', 'user_data', 'weight_scale'
    ],

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

		// return new Device(navigator.bluetooth.requestDevice(requestParams));
		return navigator.bluetooth.requestDevice(requestParams).then(device => {
			return new Device(device);
		});
	}

}

class Device {

	constructor(requestParams) {
		this.requestParams = requestParams;
		this.apiDevice = null;
		this.apiServer = null;
		// this.connected = this.checkConnectionStatus();
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
		const filters = this.requestParams;
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
			return navigator.bluetooth.requestDevice(requestParams).then(device => {
			this.apiDevice = device;
			return device.gatt.connect()
		})
		.then(server => {
			this.apiServer = server;
			return server;
		});
		// TODO: Add error functionality
	};

	/**
	 * Attempts to disconnect from BT device
	 *
	 * @Return {Boolean} successfully disconnected
	 *					returns false after 3ms
	 */
	disconnect() {
		/**
        *Disconnect from device if the connected property in the bluetooth object
        *evaluates to true.
        */
        if (this.apiServer.connected) {
          this.apiServer.disconnect();
          /**
          *If the disconnect method is called while the connected property on the
          *bluetooth object evaluates to true and the connected property in the bluetooth
          *object evaluates to false after disconnect runs, then return the boolean value
          *true to indicate that the disconnect was successful.
          */
          if (!this.apiServer.connected) {
            return true;
          }
          /**
          *If however, the connected property in the bluetooth object evaluates
          *to true after the disconnect method ran, then display an error stating that there
          *was a problem disconnecting with the device.
          */
          throw new Error('Issue disconnecting with device.');
        }
        /**
        *If the disconnect method is called while the connected property in the
        *bluetooth object is false, then display an error stating that the device
        *is not connected.
        */
        throw new Error('Could not disconnect. Device not connected.');
		// return new Promise((resolve, reject) => {
		//
		// 	// If not disconnected within 1 second, reject promise
		// 	setTimeout(() => {
		// 		if (this.connected) {
		// 			// errorHandler('disconnect_timeout', {});
		// 			return reject(false);	// TODO: does this cause an error if already resolved?
		// 		} else {
		// 			this.apiServer = null;
		// 			return resolve(true);
		// 		}
		// 	}, 1000);
		//
		// 	/**
		// 	 * If the device is connected, attempt to disconnect
		// 	 * then immediately check if successful and resolve promise
		// 	 */
		// 	if (this.connected) {
		// 		this.apiDevice.gatt.disconnect()
		// 		.then(() => {
		// 			if (!this.connected) {
		// 				this.apiServer = null;
		// 				return resolve(true);
		// 			};
		// 		})
		// 		.catch(err => {
		// 			// errorHandler('disconnect_error', {}, err);
		// 		});
		// 	}
		// });
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
		var includedProperties = characteristicObj.includedProperties;
		if (includedProperties.includes('read')){
			/**
			 * TODO: add functionality to map through all primary services
			 *       to characteristic, if multiple exist e.g. 'sensor_location'...
			 *       or add functionality at device connection to filter primary
			 *       services based on only those available to device
			 */
			return this.apiServer.getPrimaryService(characteristicObj.primaryServices[0])
			.then(service => {
				console.log('service',service);
				return service.getCharacteristic(characteristicName);
			})
			.then(characteristic => {
				console.log('char',characteristic);
				return characteristic.readValue();
			})
			.then(value => {
				console.log('value',value);
				if (!characteristicObj.parseValue) return value.getUint8(0)
				return characteristicObj.parseValue(value.getUint8(0));
			})
			.catch(err => {
				console.log('error',err);
				// errorHandler('disconnect_error', {}, err);
			})
		}
		else {
			// errorHandler('illegal action', {}, err);
		}
	} // end getValue

};
