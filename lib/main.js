
const errorHandler = require('./errorHandler');

const bluetooth = {
	gattCharacteristics: {
		battery_level: {
			primaryServices: ['battery_service'],
			includedProperties: ['read', 'notify']
		},
		blood_pressure_feature: {
			primaryServices: ['blood_pressure'],
			includedProperties: ['read']
		},
		body_composition_feature: {
			primaryServices: ['body_composition'],
			includedProperties: ['read']
		},
		bond_management_feature: {
			primaryServices: ['bond_management_feature'],
			includedProperties: ['read']
		},
		cgm_feature: {
			primaryServices: ['continuous_glucose_monitoring'],
			includedProperties: ['read']
		},
		cgm_session_run_time: {
			primaryServices: ['continuous_glucose_monitoring'],
			includedProperties: ['read']
		},
		cgm_session_start_time: {
			primaryServices: ['continuous_glucose_monitoring'],
			includedProperties: ['read', 'write']
		},
		cgm_status: {
			primaryServices: ['continuous_glucose_monitoring'],
			includedProperties: ['read']
		},
		csc_feature: {
			primaryServices: ['cycling_speed_and_cadence'],
			includedProperties: ['read']
		},
		current_time: {
			primaryServices: ['current_time'],
			includedProperties: ['read', 'write', 'notify']
		},
		cycling_power_feature: {
			primaryServices: ['cycling_power'],
			includedProperties: ['read']
		},
		firmware_revision_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		hardware_revision_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		ieee_11073_20601_regulatory_certification_data_list: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		'gap.appearance': {
			primaryServices: ['generic_access'],
			includedProperties: ['read']
		},
		'gap.device_name': {
			primaryServices: ['generic_access'],
			includedProperties: ['read', 'write']
		},
		'gap.peripheral_preferred_connection_parameters': {
			primaryServices: ['generic_access'],
			includedProperties: ['read']
		},
		'gap.peripheral_privacy_flag': {
			primaryServices: ['generic_access'],
			includedProperties: ['read']
		},
		glucose_feature: {
			primaryServices: ['glucose'],
			includedProperties: ['read']
		},
		http_entity_body: {
			primaryServices: ['http_proxy'],
			includedProperties: ['read', 'write']
		},
		http_headers: {
			primaryServices: ['http_proxy'],
			includedProperties: ['read', 'write']
		},
		https_security: {
			primaryServices: ['http_proxy'],
			includedProperties: ['read', 'write']
		},
		intermediate_temperature: {
			primaryServices: ['health_thermometer'],
			includedProperties: ['read', 'write', 'indicate']
		},
		local_time_information: {
			primaryServices: ['current_time'],
			includedProperties: ['read', 'write']
		},
		manufacturer_name_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		model_number_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		pnp_id: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		protocol_mode: {
			primaryServices: ['human_interface_device'],
			includedProperties: ['read', 'writeWithoutResponse']
		},
		reference_time_information: {
			primaryServices: ['current_time'],
			includedProperties: ['read']
		},
		supported_new_alert_category: {
			primaryServices: ['alert_notification'],
			includedProperties: ['read']
		},
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
		},
		heart_rate_measurement: {
			primaryServices: ['heart_rate'],
			includedProperties: ['notify']
		},
		serial_number_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		software_revision_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		supported_unread_alert_category: {
			primaryServices: ['alert_notification'],
			includedProperties: ['read']
		},
		system_id: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		temperature_type: {
			primaryServices: ['health_thermometer'],
			includedProperties: ['read']
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

	gattServices:
		['alert_notification', 'automation_io', 'battery_service', 'blood_pressure',
    'body_composition', 'bond_management', 'continuous_glucose_monitoring',
    'current_time', 'cycling_power', 'cycling_speed_and_cadence', 'device_information',
    'environmental_sensing', 'generic_access', 'generic_attribute', 'glucose',
    'health_thermometer', 'heart_rate', 'human_interface_device',
    'immediate_alert', 'indoor_positioning', 'internet_protocol_support', 'link_loss',
    'location_and_navigation', 'next_dst_change', 'phone_alert_status',
    'pulse_oximeter', 'reference_time_update', 'running_speed_and_cadence',
    'scan_parameters', 'tx_power', 'user_data', 'weight_scale'
    ],

}

  /**
		* @method connect - Calls navigator.bluetooth.requestDevice
		*		(?? If it has not yet been called already??), then calls device.gatt.connect
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
class BluetoothDevice {
	constructor(filters) {
		this.filters = filters;
		this.apiDevice;
		this.apiServer = null;
		this.characteristics = {}; // FIXME: Add service objects
	}

	/**
		* checks apiDevice.gatt.connected to check whether device is connected
		*/
	connected() {
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
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/; // TODO: Add error for invalid UUID
		const requestParams = {
			filters: []
		};

		// TODO: Should there be a condition for if this.apiDevice is already defined, ie. reconnect?
		if (this.filters) {
			if (this.filters.name) requestParams.filters.push({ name: filters.name });
			if (this.filters.namePrefix) requestParams.filters.push({ namePrefix: filters.namePrefix });
			if (this.filters.uuid) requestParams.filters.push({ uuid: filters.uuid });
			if (this.filters.services) requestParams.filters.push({ services: filters.services });
			if (this.filters.optionalServices) requestParams.optionalServices = filters.optionalServices;
			else requestParams.optionalServices = bluetooth.gattServices;
		} else {
			/**
				* If no filters are passed in, throw error no_filters
				*	TODO: Catch error for "user canceled request device chooser"
				*					and "bluetooth not available"
				*/
			// errorHandler('no_filters'/*, Context Object, Native Error*/);
		}

		navigator.bluetooth.requestDevice(requestParams)
			.then(device => {
				this.apiDevice = device;
				return device.gatt.connect();
			})
			.then(server => {
				this.apiServer = server;
				return server;
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
	 * @param {string} characteristicName GATT characteristic name
	 * @return {Promise} A promise to the characteristic value
	 *
	 */
	value(characteristicName) { // TODO: add error handling for absent characteristics and characteristic properties
		const characteristicObj = this.gattCharacteristics[characteristicName];

		if (characteristicObj.includedProperties.includes('read')){
			/**
			 	* TODO: Add functionality to map through all primary services
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
}


} // End of Device constructor

/**
 * Attempts to write characteristic value to BT device
 *
 * @param {string} characteristicName GATT characteristic name
 * @param {integer} value Value to be written to device TODO: what does this look
 * 																														like: buffer?
 * 																														formatting?
 * @return {Promise} A promise to the result of writing to the device
 *
 */
writeValue(characteristicName, value) {
	// TODO: add error handling for absent characteristics and characteristic properties
	var characteristicObj = Bluetooth.gattCharacteristicsMapping[characteristicName];
	if (characteristicObj.includedProperties.includes('write')){
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
			return characteristic.writeValue(value);
		})
		.then(result => {
			return true; //TODO: what do we want to return here?
		})
		.catch(err => {
			// errorHandler('disconnect_error', {}, err);
		})
	}
	else {
		// errorHandler('illegal action', {}, err);
	}
} // end writeValue


// TODO: These are our desired exports, but is this the right way to access them?
module.exports = function() {
	const bluetooth = bluetooth;
	return BluetoothDevice;
}
