const errorHandler = require('./errorHandler');

const bluetooth = {
	gattCharacteristicsMapping: {

		// battery_level characteristic
		battery_level: {
			primaryServices: ['battery_service'],
			includedProperties: ['read','notify']
		},
		//blood_pressure_feature characteristic
		blood_pressure_feature: {
			primaryServices: ['blood_pressure'],
			includedProperties: ['read']
		},
		//body_composition_feature characteristic
		body_composition_feature: {
			primaryServices: ['body_composition'],
			includedProperties: ['read']
		},
		//bond_management_feature
		bond_management_feature: {
			primaryServices: ['bond_management_feature'],
			includedProperties: ['read']
		},
		//cgm_feature characteristic
		cgm_feature: {
			primaryServices: ['continuous_glucose_monitoring'],
			includedProperties: ['read']
		},
		//cgm_session_run_time characteristic
		cgm_session_run_time: {
			primaryServices: ['continuous_glucose_monitoring'],
			includedProperties: ['read']
		},
		//cgm_session_start_time characteristic
		cgm_session_start_time: {
			primaryServices: ['continuous_glucose_monitoring'],
			includedProperties: ['read', 'write']
		},
		//cgm_status characteristic
		cgm_status: {
			primaryServices: ['continuous_glucose_monitoring'],
			includedProperties: ['read']
		},
		//csc_feature characteristic
		csc_feature: {
			primaryServices: ['cycling_speed_and_cadence'],
			includedProperties: ['read']
		},
		//current_time characteristic
		current_time: {
			primaryServices: ['current_time'],
			includedProperties: ['read', 'write', 'notify']
		},
		//cycling_power_feature characteristic
		cycling_power_feature: {
			primaryServices: ['cycling_power'],
			includedProperties: ['read']
		},
		//firmware_revision_string characteristic
		firmware_revision_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		//hardware_revision_string characteristic
		hardware_revision_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		//ieee_11073-20601_regulatory_certification_data_list characteristic
		ieee_11073_20601_regulatory_certification_data_list: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		//gap.appearance characteristic
		'gap.appearance': {
			primaryServices: ['generic_access'],
			includedProperties: ['read']
		},
		//gap.device_name charcteristic
		'gap.device_name': {
			primaryServices: ['generic_access'],
			includedProperties: ['read', 'write']
		},
		//gap.peripheral_preferred_connection_parameters characteristic
		'gap.peripheral_preferred_connection_parameters': {
			primaryServices: ['generic_access'],
			includedProperties: ['read']
		},
		//gap.peripheral_privacy_flag characteristic
		'gap.peripheral_privacy_flag': {
			primaryServices: ['generic_access'],
			includedProperties: ['read']
		},
		//glucose_feature characteristic
		glucose_feature: {
			primaryServices: ['glucose'],
			includedProperties: ['read']
		},
		//http_entity_body characteristic
		http_entity_body: {
			primaryServices: ['http_proxy'],
			includedProperties: ['read', 'write']
		},
		//http_headers characteristic
		http_headers: {
			primaryServices: ['http_proxy'],
			includedProperties: ['read', 'write']
		},
		//https_security characteristic
		https_security: {
			primaryServices: ['http_proxy'],
			includedProperties: ['read', 'write']
		},
		//intermediate_temperature characteristic
		intermediate_temperature: {
			primaryServices: ['health_thermometer'],
			includedProperties: ['read', 'write', 'indicate']
		},
		//local_time_information characteristic
		local_time_information: {
			primaryServices: ['current_time'],
			includedProperties: ['read', 'write']
		},
		//manufacturer_name_string characteristic
		manufacturer_name_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		//model_number_string characteristic
		model_number_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		//pnp_id characteristic
		pnp_id: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		//protocol_mode characteristic
		protocol_mode: {
			primaryServices: ['human_interface_device'],
			includedProperties: ['read', 'writeWithoutResponse']
		},
		//reference_time_information characteristic
		reference_time_information: {
			primaryServices: ['current_time'],
			includedProperties: ['read']
		},
		//supported_new_alert_category
		supported_new_alert_category: {
			primaryServices: ['alert_notification'],
			includedProperties: ['read']
		},
		// sensor_location characteristic
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
		//serial_number_string characteristic
		serial_number_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		//software_revision_string characteristic
		software_revision_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		//supported_unread_alert_category characteristic
		supported_unread_alert_category: {
			primaryServices: ['alert_notification'],
			includedProperties: ['read']
		},
		//system_id characteristic
		system_id: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		//temperature_type characteristic
		temperature_type: {
			primaryServices: ['health_thermometer'],
			includedProperties: ['read']
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
    ]
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

	constructor(requestParams) {
		this.requestParams = requestParams;
		this.apiDevice = null;
		this.apiServer = null;
		this.cache = {};
	}

	/**
		* checks apiDevice to see whether device is connected
		*/
	connected() {
		if(!this.apiDevice) return errorHandler('no_device');
		return this.apiDevice.gatt.connected;
	}

	/**
		* Establishes a new GATT connection w/ the device
		* 	and stores the return of the promise as this.apiServer
		*
	  */
	connect() {
		const filters = this.requestParams;
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/; // TODO: Add error for invalid U
		if (Object.keys(filters).length) {
			const requestParams = {
				filters: [],
			};
			if (filters.name) requestParams.filters.push({ name: filters.name });
			if (filters.namePrefix) requestParams.filters.push({ namePrefix: filters.namePrefix });
			if (filters.uuid) {
				if (!filters.uuid.match(uuidRegex)) {
					errorHandler('uuid_error');
				}
				else {
					requestParams.filters.push({ uuid: filters.uuid });
				}
			}
			if (filters.services) {
				let services =[];
				filters.services.forEach(service => {
					if (bluetooth.gattServiceList.indexOf(service) < 0) {
						console.warn(`${service} is not a valid service. Please check the service name.`);
					}
					else {
						services.push(service);
					}
				});
				requestParams.filters.push({ services: services });
			}
			if (filters.optional_services) {
				filters.optional_services.forEach(service => {
					if(bluetooth.gattServiceList.indexOf(service) < 0) bluetooth.gattServiceList.push(service);
				});
			}

			requestParams.optionalServices = bluetooth.gattServiceList;

			return navigator.bluetooth.requestDevice(requestParams).then(device => {
				this.apiDevice = device;
				return device.gatt.connect()
			})
			.then(server => {
				this.apiServer = server;
				return server;
			})
			.catch(err => {
				errorHandler('user_cancelled',err);
				return;
			});
		} else {
			return errorHandler('no_filters');
		}
	};

	/**
	 * Attempts to disconnect from BT device
	 *
	 * @Return {Boolean} successfully disconnected
	 *					returns an error.
	 * Disconnect from device if the connected property in the bluetooth object
	 * evaluates to true otherwise, disconnecting issue throws an error.
	 */
	disconnect() {
        if (this.apiServer.connected) {
          this.apiServer.disconnect();
          if (!this.apiServer.connected) {
            return true;
          }
					return errorHandler('issue_disconnecting');
        }
				return errorHandler('not_connected');
	}

	/**
	 * Gets characteristic value from BT device. This is a non-read value.
	 * Upon a successful connection to the device and can read the service/characteristic,
	 * we cache the device in this.cache. Subsequent connections will check the cach first
	 * to limit the number of asynchronous requests to the device.
	 * @param {string} GATT characteristic  name
	 * @return {Promise} A promise to the characteristic value
	 *
	 */
	 // TODO: changing to 'value' from 'getValue'
	getValue(characteristicName) {
		// TODO: add error handling for absent characteristics and characteristic properties
		if (!bluetooth.gattCharacteristicsMapping[characteristicName]) {
			return errorHandler('characteristic_error', null, characteristicName);
		}
		else if (!bluetooth.gattCharacteristicsMapping[characteristicName].includedProperties.includes('read')) {
			return errorHandler('no_read_property',null, characteristicName);
		}
		else {
			/**
			 * TODO: add functionality to map through all primary services
			 *       to characteristic, if multiple exist e.g. 'sensor_location'...
			 *       or add functionality at device connection to filter primary
			 *       services based on only those available to device
			 */
		 var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristicName];
		 var includedProperties = characteristicObj.includedProperties;
		 var primaryServiceName = characteristicObj.primaryServices[0];
			if (this.cache[primaryServiceName]) {
				return this.cache[primaryServiceName].GATTCharacteristic.readValue()
				.then(value => {
					if (!characteristicObj.parseValue) return value.getUint8(0);
					return characteristicObj.parseValue(value.getUint8(0));
				})
				.catch(err => {
					return errorHandler('read_error',err);
				});
			}
			else {
				return this.apiServer.getPrimaryService(primaryServiceName)
				.then(service => {
					this.cache[primaryServiceName] = {'GATTService': service};
					return service.getCharacteristic(characteristicName);
				})
				.then(characteristic => {
					this.cache[primaryServiceName]['GATTCharacteristic'] = characteristic;
					return characteristic.readValue();
				})
				.then(value => {
					if (!characteristicObj.parseValue) return value.getUint8(0)
					return characteristicObj.parseValue(value.getUint8(0));
				})
				.catch(err => {
					return errorHandler('read_error',err);
				});
			}
	 }
	} // end getValue

	/**
	 * Writes to the device.
	 *
	 * TODO: Need to include details of this method.
	 *
	 * @param {String} characteristicName - GATT characteristic  name
	 * @param {String or Number} value - String or Number will be prepped to be written to the device.
	 * @return {Promise} A promise to the characteristic value
	 *
	 */

	postValue(characteristicName, value){

		if(!bluetooth.gattCharacteristicsMapping[characteristicName]) {
			return errorHandler('characteristic_error',null,characteristicName);
		}
		else if (!includedProperties.includes('write')) {
			return errorHandler('write_permissions', null, characteristicName);
		}
		else {
			/**
			 * TODO: add functionality to map through all primary services
			 *       to characteristic, if multiple exist e.g. 'sensor_location'...
			 *       or add functionality at device connection to filter primary
			 *       services based on only those available to device
			 */
		var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristicName];
	 	var includedProperties = characteristicObj.includedProperties;
		return this.apiServer.getPrimaryService(characteristicObj.primaryServices[0])
			.then(service => {
				return service.getCharacteristic(characteristicName);
			})
			.then(characteristic => {
				/**
				*TODO: Add functionality to make sure that the values passed in are in the proper format,
				*	   and are compatible with the writable device.
				*/
				return characteristic.writeValue(value);
			})
			.then(changedChar => {
				return value;
			})
			.catch(err => {
				return errorHandler('write_error',err,characteristicName);
			})
		}
		// else {
		// 	return errorHandler('characteristic_error',null,characteristicName);
		// }
	} // end of postValue

	/**
	 * Attempts to start notifications for changes to BT device values and retrieve
	 * updated values
	 *
	 * @param {String} characteristicName - GATT characteristic name
	 * @param {Function} func - callback function that we're applying an event listener to
	 * @return TODO: what does this return!?!
	 *
	 */
	startNotifications(characteristicName, func){

		if (!bluetooth.gattCharacteristicsMapping[characteristicName]) {
			return errorHandler('characteristic_error', null, characteristicName);
		}
		else if (!bluetooth.gattCharacteristicsMapping[characteristicName].includedProperties.includes('notify')) {
			return errorHandler('start_notifications_no_notify', null, characteristicName);
		}
		else {
			/**
			 * TODO: add functionality to map through all primary services
			 *       to characteristic, if multiple exist e.g. 'sensor_location'...
			 *       or add functionality at device connection to filter primary
			 *       services based on only those available to device
			 */
		 var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristicName];
		 var includedProperties = characteristicObj.includedProperties;
		 var primaryServiceName = characteristicObj.primaryServices[0];

		 if (this.cache[primaryServiceName]) {
			 return this.cache[primaryServiceName].GATTCharacteristic.startNotifications()
			 .then(() => {
				 this.cache[primaryServiceName]['notifying'] = true;
				 return characteristic.addEventListener('characteristicvaluechanged', event => {
					 func(event);
				 });
			 })
			 .catch(err => {
				 return errorHandler('start_notifications_notifications_error', err, characteristicName);
			 });
		 }
		 else {
			 return this.apiServer.getPrimaryService(primaryServiceName)
			 .then(service => {
				 this.cache[primaryServiceName] = {'GATTService': service};
				 return service.getCharacteristic(characteristicName);
			 })
			 .then(characteristic => {
				 /**
				 *TODO: Add functionality to make sure that the values passed in are in the proper format,
				 *	   and are compatible with the writable device.
				 */
				 this.cache[primaryServiceName]['GATTCharacteristic'] = characteristic;
				 return characteristic.startNotifications()
				 .then( () => {
					 this.cache[primaryServiceName]['notifying'] = true;
					 return characteristic.addEventListener('characteristicvaluechanged', event => {
						 func(event);
					 });
				 })
			 })
			 .catch(err => {
				 return errorHandler('start_notifications_notifications_error', err, characteristicName);
			 }); // end of catchaco
		 } // End of else
	 } // End of notify conditional
		// else {
		// 	return errorHandler('characteristic_error',null,characteristicName);
		// } // end of else conditional
	} // end of start notifications

	/**
	* Stops a specific notification based on the characteristicName passed in as a param.
	* @param {String} characteristicName - Gatt characteristic name
	* @return {Boolean} - If the method successfully stops notifications, it will return true.
	*											If there is an error, it will throw an error.
	*/
	stopNotifications(characteristicName) {
		if (!bluetooth.gattCharacteristicsMapping[characteristicName]) {
			return errorHandler('characteristic_error', null, characteristicName);
		}
		else if (bluetooth.gattCharacteristicsMapping[characteristicName]) {
			var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristicName];
			var includedProperties = characteristicObj.includedProperties;
			var primaryServiceName = characteristicObj.primaryServices[0];

			if(this.cache[primaryServiceName]['notifying']) {
				return this.cache[primaryServiceName].GATTCharacteristic.stopNotifications()
				.then(() => {
					this.cache[primaryServiceName]['notifying'] = false;
					return true;
				})
				.catch(err => {
					return errorHandler('stop_notifications_notifications_error', err, characteristicName);
				});
			}
			else {
				errorHandler('stop_notifications_not_notifying',null,characteristicName);
			}
		}
		}
}

// TODO: These are our desired exports, but is this the right way to access them?
module.exports = function() {
	const bluetooth = bluetooth;
	return BluetoothDevice;
}
