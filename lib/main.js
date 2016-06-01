// Error Handler
import { errorHandler } from "/utils/errorHandler";
// Bluetooth Map
import { bluetooth } from "/utils/bluetoothMap";

  /**
		* @method connect - Calls navigator.bluetooth.requestDevice
		* 										then calls device.gatt.connect
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
		* @return {Object} Returns a new instance of BluetoothDevice
		*
		*/
export default class BluetoothDevice {

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
	  */
	connect() {
		const filters = this.requestParams;
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
		if (Object.keys(filters).length) {
			const requestParams = {
				filters: [],
			};
			// FIXME: validate name and throw error if not valid - 'string'
			if (filters.name) requestParams.filters.push({ name: filters.name });
			// FIXME: validate name and throw error if not valid - 'string'
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
					// FIXME: use includes instead of indexOf
					if(bluetooth.gattServiceList.indexOf(service) < 0) bluetooth.gattServiceList.push(service);
				});
			}

			requestParams.optionalServices = bluetooth.gattServiceList;

			// TODO: think about what we want to return here.
			return navigator.bluetooth.requestDevice(requestParams).then(device => {
				this.apiDevice = device;
				return device.gatt.connect()
			})
			.then(server => {
				this.apiServer = server;
				return server;
			})
			.catch(err => {
				// FIXME: parse error as it can be a result of a few things: 1. user cancelled, 2. 'unknown connection error'
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
					//TODO: check if this is asynchronous when retesting.
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
	 // FIXME: refactor caching.
	getValue(characteristic_name) {
		// TODO: add error handling for absent characteristics and characteristic properties
		if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
			return errorHandler('characteristic_error', null, characteristic_name);
		}
		else if (!bluetooth.gattCharacteristicsMapping[characteristic_name].includedProperties.includes('read')) {
			return errorHandler('no_read_property',null, characteristic_name);
		}
		else {
			/**
			 * TODO: add functionality to map through all primary services
			 *       to characteristic, if multiple exist e.g. 'sensor_location'...
			 *       or add functionality at device connection to filter primary
			 *       services based on only those available to device
			 */
		 var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];
		 var includedProperties = characteristicObj.includedProperties;
		 //FIXME: Consider functionality for characteristics that are children of multiple services (primaryServiceName)
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
					return service.getCharacteristic(characteristic_name);
				})
				.then(characteristic => {
					this.cache[primaryServiceName]['GATTCharacteristic'] = characteristic;
					return characteristic.readValue();
				})
				.then(value => {
					if (!characteristicObj.parseValue) {
							return errorHandler('parsing_not_supported', null, characteristic_name);
					}
					//TODO: need to import new bluetoothmap object with parsing methods on the characteristics. This implementation won't work without it.
					return characteristicObj.parseValue(value);
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
	 * TODO: (Aarom) - understand the prepping. How many different cases we need for this?
	 •
	 * @param {String} characteristic_name - GATT characteristic  name
	 * @param {String or Number} value - String or Number will be prepped to be written to the device.
	 * 																	 This value is unprepped.
	 * @return {Promise} A promise to the characteristic value
	 *
	 */

	write(characteristic_name, value){

		if(!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
			return errorHandler('characteristic_error',null,characteristic_name);
		}
		else if (!includedProperties.includes('write')) {
			return errorHandler('write_permissions', null, characteristic_name);
		}
		else {
			/**
			 * TODO: add functionality to map through all primary services
			 *       to characteristic, if multiple exist e.g. 'sensor_location'...
			 *       or add functionality at device connection to filter primary
			 *       services based on only those available to device
			 */
		var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];
	 	var includedProperties = characteristicObj.includedProperties;

		//TODO: Add check against the cache for characteristic and service.

		return this.apiServer.getPrimaryService(characteristicObj.primaryServices[0])
			.then(service => {
				return service.getCharacteristic(characteristic_name);
			})
			.then(characteristic => {
				/**
				*TODO: Add functionality to make sure that the values passed in are in the proper format,
				*	   and are compatible with the writable device.
				*/
				return characteristic.writeValue(value);
			})
			.then(changedChar => {
				//FIXME: what do we want return? check how this resolves (i.e Undefined?).
				return value;
			})
			.catch(err => {
				return errorHandler('write_error',err,characteristic_name);
			})
		}
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

	// FIXME: refactor caching.
	startNotifications(characteristic_name, func){

		if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
			return errorHandler('characteristic_error', null, characteristic_name);
		}
		else if (!bluetooth.gattCharacteristicsMapping[characteristic_name].includedProperties.includes('notify')) {
			return errorHandler('start_notifications_no_notify', null, characteristic_name);
		}
		else {
			/**
			 * TODO: add functionality to map through all primary services
			 *       to characteristic, if multiple exist e.g. 'sensor_location'...
			 *       or add functionality at device connection to filter primary
			 *       services based on only those available to device
			 */
		 var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];
		 var includedProperties = characteristicObj.includedProperties;
		 var primaryServiceName = characteristicObj.primaryServices[0];

		 if (this.cache[primaryServiceName]) {
			 return this.cache[primaryServiceName].GATTCharacteristic.startNotifications()
			 .then(() => {
				 this.cache[primaryServiceName]['notifying'] = true;
				 return characteristic.addEventListener('characteristicvaluechanged', event => {
					 let parsed_event = characteristicObj.parseValue(event);
					 func(parsed_event);
				 });
			 })
			 .catch(err => {
				 return errorHandler('start_notifications_notifications_error', err, characteristic_name);
			 });
		 }
		 else {
			 return this.apiServer.getPrimaryService(primaryServiceName)
			 .then(service => {
				 this.cache[primaryServiceName] = {'GATTService': service};
				 return service.getCharacteristic(characteristic_name);
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
				 return errorHandler('start_notifications_notifications_error', err, characteristic_name);
			 }); // end of catchaco
		 } // End of else
	 } // End of notify conditional
	} // end of start notifications

	/**
	* Stops a specific notification based on the characteristicName passed in as a param.
	* @param {String} characteristicName - Gatt characteristic name
	* @return {Boolean} - If the method successfully stops notifications, it will return true.
	*											If there is an error, it will throw an error.
	*/
	stopNotifications(characteristic_name) {
		if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
			return errorHandler('characteristic_error', null, characteristic_name);
		}
		else if (bluetooth.gattCharacteristicsMapping[characteristic_name]) {
			var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];
			var includedProperties = characteristicObj.includedProperties;
			var primaryServiceName = characteristicObj.primaryServices[0];

			if(this.cache[primaryServiceName]['notifying']) {
				return this.cache[primaryServiceName].GATTCharacteristic.stopNotifications()
				.then(() => {
					//TODO: WHat do we want to return?
					this.cache[primaryServiceName]['notifying'] = false;
					return true;
				})
				.catch(err => {
					return errorHandler('stop_notifications_notifications_error', err, characteristic_name);
				});
			}
			else {
				errorHandler('stop_notifications_not_notifying',null,characteristic_name);
			}
		}
		}
}

// TODO: CACHING SCHEMA

// this.cache = {
// 	heart_rate : {
//   	service: 'service',
//   	heart_rate_measurement : {
//     	notifying: true,
//       characteristic: 'characteristic'
//     },
//     body_sensor_location : {
//     	notifying: true,
//       characteristic: 'characteristic'
//     }
//   },
//   blood_glucose : {
//   	service: 'service',
//   	heart_rate_measurement : {
//     	notifying: true,
//       characteristic: 'characteristic'
//     },
//     body_sensor_location : {
//     	notifying: true,
//       characteristic: 'characteristic'
//     }
//   }
// }
