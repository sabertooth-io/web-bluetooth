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
					if (!bluetooth.gattServiceList.includes(service)) {
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
					if(!bluetooth.gattServiceList.includes(service)) bluetooth.gattServiceList.push(service);
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
	 * Gets requested characteristic before attempting to read value of that characteristic
	 * and returning an object with the parsed value (if characterisitc is fully supported)
	 * and raw value (provided regardles of whether device is fully supported or not).
	 *
	 * @param {string} characteristic_name - GATT characteristic  name
	 * @return {Object} An object that includes key-value pairs for each of the properties
	 *									successfully read and parsed from the device, as well as the
	 *									raw value object returned by a native readValue request to the
	 *									device characteristic.
	 */
	getValue(characteristic_name) {
		/**
		* Check to see if characteristic exists in bluetooth.gattCharacteristicsMapping
		* and throw error if not found.
		*/
		if(!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
			return errorHandler('characteristic_error', null, characteristic_name);
		}
		// Retrieve characteristic object from bluetooth.gattCharacteristicsMapping
		var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];
		/**
		* Check characteristic object to see if support for read property is provided.
		* If not provided, proceed with attempt to read value of characteristic but
		* provide warning indicating such.
		*/
		if(!characteristicObj.includedProperties.includes('read')) {
			console.warn(`Attempting to access read property of ${characteristic_name},
										which is not a included as a supported property of the
										characteristic. Attempt will resolve with an object including
										only a rawValue property with the native API return
										for an attempt to readValue() of ${characteristic_name}.`);
			}
		// Call returnCharacteristic to retrieve characteristic from which to read
		return new Promise((resolve,reject)=>{
			return resolve(this.returnCharacteristic(characteristic_name))
		})
			.then(characteristic =>{
				return characteristic.readValue();
			})
			.then(value =>{
				/**
				* Check characteristic object to see if parsing method exists. If present,
				* call the parseValue method with value returned from readValue() as the
				* argument, and add returned value from readValue() as another parameter to
				* the returned object from parseValue before returning. If no parsing method
				* is present, return an object with the returned value from readValue() as
				* the only parameter.
				*/
				let returnObj = characteristicObj.parseValue ? characteristicObj.parseValue(value):{};
				// Always include the raw value returned from readValue() in the object returned
				returnObj.rawValue = value;
				return returnObj;
			})
			.catch(err => {
				return errorHandler('read_error',err);
			});
	} // End getValue

	/**
	 * Attempts to write a given value to the device for a given characteristic
	 •
	 * @param {String} characteristic_name - GATT characteristic  name
	 * @param {String or Number} value - String or Number that will be written to
	 																		 the requested device characteristic
	 * FIXME: What do we want to return?
	 * @return {Boolean} - Result of attempt to write characteristic where true === successfully written
	 */
	writeValue(characteristic_name, value){
		/**
		* Check to see if characteristic exists in bluetooth.gattCharacteristicsMapping
		* and throw error if not found.
		*/
		if(!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
			return errorHandler('characteristic_error', null, characteristic_name);
		}
		// Retrieve characteristic object from bluetooth.gattCharacteristicsMapping
		var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];
		/**
		* Check characteristic object to see if support for write property is provided.
		* If not provided, proceed with attempt to write value to characteristic but
		* provide warning indicating such.
		*/
		if(!characteristicObj.includedProperties.includes('write')) {
			console.warn(`Attempting to access write property of ${characteristic_name},
										which is not a included as a supported property of the
										characteristic. Attempt will resolve with native API return
										for an attempt to writeValue(${value}) to ${characteristic_name}.`);
			}
		// Call returnCharacteristic to retrieve characteristic from which to read
		return new Promise((resolve,reject)=>{
			return resolve(this.returnCharacteristic(characteristic_name))
		})
			.then(characteristic => {
				/**
				* Check characteristic object to see if prepping method exists. If present,
				* call the prepValue method with the provided value as the argument. If
				* no prepping method is present, attempt to call writeValue() to the
				* characteristic with the provided value as the the argument.
				*/
				value = characteristicObj.prepValue ? characteristicObj.prepValue(value):value;
				return characteristic.writeValue(value);
			})
			.then(changedChar => {
				//FIXME: what do we want return? check how this resolves (i.e Undefined?).
				return value;
			})
			.catch(err => {
				return errorHandler('write_error',err,characteristic_name);
			})
	} // End writeValue

	/**
	* Attempts to start notifications for changes to device values and adds event
	* listener to listen for events to which a provided callback will be applied
	*
	* @param {String} characteristic_name - GATT characteristic name
	* @param {Function} func - callback function to apply to each event while
															notifications are active
	* FIXME: What do we want to return? The event returned is visible in the callback provided... so maybe nothing?
	* @return TBD
	*
	*/
	startNotifications(characteristic_name, func){
		/**
		* Check to see if characteristic exists in bluetooth.gattCharacteristicsMapping
		* and throw error if not found.
		*/
		if(!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
			return errorHandler('characteristic_error', null, characteristic_name);
		}
		// Retrieve characteristic object and primary service from bluetooth.gattCharacteristicsMapping
		var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];
		var primary_service_name = characteristicObj.primaryServices[0];
		/**
		* Check characteristic object to see if support for notify property is provided.
		* If not provided, proceed with attempt to start notifications from characteristic but
		* provide warning indicating such.
		*/
		if(!characteristicObj.includedProperties.includes('notify')) {
			console.warn(`Attempting to access notify property of ${characteristic_name},
										which is not a included as a supported property of the
										characteristic. Attempt will resolve with an object including
										only a rawValue property with the native API return
										for an attempt to startNotifications() for ${characteristic_name}.`);
			}
		// Call returnCharacteristic to retrieve characteristic from which to read
		return new Promise((resolve,reject)=>{
			return resolve(this.returnCharacteristic(characteristic_name))
		})
			.then(characteristic =>{
				// Start notifications from characteristic and add event listener
				characteristic.startNotifications()
				.then(() => {
					/**
					* After successfully starting notifications from characteristic, update
					* cache to reflect current notification status.
					*/
					this.cache[primary_service_name][characteristic_name].notifying = true;
					// Add listener to subscribe to notifications from device
					return characteristic.addEventListener('characteristicvaluechanged', event => {
						/**
						* Check characteristic object to see if parsing method exists. If present,
						* call the parseValue method with value attached to the event object,
						* and add the raw event object as another parameter to the returned
						* object from parseValue before returning. If no parsing method is
						* present, return an object with the raw event object as the only parameter.
						*/
						let eventObj = characteristicObj.parseValue ? characteristicObj.parseValue(event.target.value):{};
						// Always include the raw event object in the object returned
						eventObj.rawValue = event;
						func(eventObj);
					});
				})
				.catch(err => {
					return errorHandler('start_notifications_error', err, characteristic_name);
				});
			})
	} // End startNotifications

	/**
	* Attempts to stop previously started notifications for a provided characteristic
	*
	* @param {String} characteristic_name - GATT characteristic name
	* FIXME: What do we want to return?
	* @return {Boolean} - Result of attempt to stop notifications where true === successfully written
	*/
	stopNotifications(characteristic_name) {
			/**
			* Check to see if characteristic exists in bluetooth.gattCharacteristicsMapping
			* and throw error if not found.
			*/
			if(!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
				return errorHandler('characteristic_error', null, characteristic_name);
			}
			// Retrieve characteristic object and primary service from bluetooth.gattCharacteristicsMapping
			var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];
			var primary_service_name = characteristicObj.primaryServices[0];
			/**
			* Check characteristic object to see if notifications are currently active
			* and attempt to stop notifications if active, otherwise throw error.
			*/
			if(this.cache[primary_service_name][characteristic_name].notifying) {
				// Call returnCharacteristic to retrieve characteristic from which to read
				return new Promise((resolve,reject)=>{
					return resolve(this.returnCharacteristic(characteristic_name))
				})
					.then(characteristic =>{
						characteristic.stopNotifications()
						.then(() => {
							/**
							* After successfully stopping notifications from characteristic, update
							* cache to reflect current notification status.
							*/
							this.cache[primary_service_name][characteristic_name].notifying = false;
							// FIXME: what do we want to return here?
							return true;
						})
						.catch(err => {
							return errorHandler('stop_notifications_error', err, characteristic_name);
						})
					})
			}
			else {
				errorHandler('stop_notifications_not_notifying',null,characteristic_name);
			}
		} // End stopNotifications

		/**
		* Adds a new characteristic object to  bluetooth.gattCharacteristicsMapping
		*
		* @param {String} characteristic_name - GATT characteristic name or other characteristic
		* @param {String} primary_service_name - GATT primary service name or other parent service of characteristic
		* @param {Array} propertiesArr - Array of GATT properties as Strings
		* FIXME: What do we want to return?
		* @return {Boolean} - Result of attempt to add characteristic where true === successfully added
		*/
		addCharacteristic(characteristic_name, primary_service_name, propertiesArr) {
			/**
			* Check to see if characteristic exists in bluetooth.gattCharacteristicsMapping
			* and throw error if found.
			*/
			if(bluetooth.gattCharacteristicsMapping[characteristic_name]) {
				return errorHandler('add_characteristic_exists_error', null, characteristic_name);
			}
			// Check formatting of characteristic_name and throw error if improperly formatted
			if (!characteristic_name || characteristic_name.constructor !== String || !characteristic_name.length){
				return errorHandler(`improper_characteristic_format`,null, characteristic_name);
			}
			/**
			* If characteristic does not exist in bluetooth.gattCharacteristicsMapping
			* validate presence and format of other required parameters. Throw errors if
			* other required parameters are missing or improperly formatted.
			*/
			if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
				// If missing any of other required parameters, throw error
				if (!primary_service_name || !propertiesArr) {
					return errorHandler(`new_characteristic_missing_params`,null, characteristic_name);
				}
				// Check formatting of primary_service_name and throw error if improperly formatted
				if (primary_service_name.constructor !== String || !primary_service_name.length){
					return errorHandler(`improper_service_format`,null, primary_service_name);
				}
				// Check formatting of propertiesArr and throw error if improperly formatted
				// TODO: Add validation and error handling for all properties in propertiesArr
				if (propertiesArr.constuctor !== Array || !propertiesArr.length) {
					return errorHandler(`improper_properties_format`,null, propertiesArr);
				}
				/**
				* If all parameters are present and properly formatted add new object to
				* bluetooth.gattCharacteristicsMapping and provide warning that added
				* characteristic is not fully supported.
				*/
				console.warn(`Attempting to add ${characteristic_name}. Full support
											for this characteristic is not provided.`);
				bluetooth.gattCharacteristicsMapping[characteristic_name] = {
					primaryServices: [primary_service_name],
					includedProperties: propertiesArr
				}
				// FIXME: What do we want to return here?
				return true;
			}
		} // End addCharacteristic

		/**
		* Returns a cached characteristic or resolved characteristic after successful
		* connection with device
		*
		* @param {String} characteristic_name - GATT characteristic name
		* @return {Object} - If the method successfully retrieves the characteristic,
		*											that characteristic is returned
		*/
		returnCharacteristic(characteristic_name) {
			/**
			* Check to see if characteristic exists in bluetooth.gattCharacteristicsMapping
			* and throw error if not found.
			*/
			if(!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
				return errorHandler('characteristic_error', null, characteristic_name);
			}
			/**
			* Retrieve characteristic object from bluetooth.gattCharacteristicsMapping
			* and establish primary service
			* FIXME: Consider characteristics that are children of multiple services
			*/
			 var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];
			 var primary_service_name = characteristicObj.primaryServices[0];
			 /**
				* Check to see if requested characteristic has been cached from a previous
				* interaction of any type to characteristic_name and return if found
				* FIXME: clean up if statement conditions... this is sloppy and semantically clunky
				*/
			 if (this.cache[primary_service_name] && this.cache[primary_service_name][characteristic_name] && this.cache[primary_service_name][characteristic_name].cachedCharacteristic) {
					 return this.cache[primary_service_name][characteristic_name].cachedCharacteristic;
			 }
			 /**
				* Check to see if requested characteristic's parent primary service  has
				* been cached from a any previous interaction with that primary service
				*/
			 else if (this.cache[primary_service_name] && this.cache[primary_service_name].cachedService) {
					/**
					* If parent primary service has been cached, use getCharacteristic method
					* on the cached service and cache resolved characteristic before returning
					*/
					this.cache[primary_service_name].cachedService.getCharacteristic(characteristic_name)
					.then(characteristic => {
						// Cache characteristic before returning characteristic
						this.cache[primary_service_name][characteristic_name] = {'cachedCharacteristic': characteristic};
						return characteristic;
					})
					.catch(err => {
						return errorHandler('returnCharacteristic_error', err, characteristic_name);
					});
				}
				/**
				* If neither characteristic nor any parent primary service of that characteristic
				* has been cached, use cached device server to access and cache both the
				* characteristic and primary parent service before returning characteristic
				*/
				else {
					return this.apiServer.getPrimaryService(primary_service_name)
					.then(service => {
						// Cache primary service before attempting to access characteristic
						this.cache[primary_service_name] = {'cachedService': service};
						return service.getCharacteristic(characteristic_name);
					})
					.then(characteristic => {
						// Cache characteristic before returning characteristic
						this.cache[primary_service_name][characteristic_name] = {'cachedCharacteristic': characteristic};
						return characteristic;
					})
					.catch(err => {
						return errorHandler('returnCharacteristic_error', err, characteristic_name);
					});
				}
		} // End returnCharacteristic

} // End Device constructor
