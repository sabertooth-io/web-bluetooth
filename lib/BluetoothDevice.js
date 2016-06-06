const bluetooth = require('./bluetoothMap');
const errorHandler = require('./errorHandler');

/** BluetoothDevice -
  *
  * @method connect - Establishes a connection with the device
  * @method connected - checks apiDevice to see whether device is connected
  * @method disconnect - terminates the connection with the device and pauses all data stream subscriptions
  * @method getValue - reads the value of a specified characteristic
  * @method writeValue - writes data to a specified characteristic of the device
  * @method startNotifications - attempts to start notifications for changes to device values and attaches an event listener for each data transmission
  * @method stopNotifications - attempts to stop previously started notifications for a provided characteristic
  * @method addCharacteristic - adds a new characteristic object to bluetooth.gattCharacteristicsMapping
  * @method _returnCharacteristic - _returnCharacteristic - returns the value of a cached or resolved characteristic or resolved characteristic
  *
  * @param {object} filters - collection of filters for device selectin. All filters are optional, but at least 1 is required.
  *          .name {string}
  *          .namePrefix {string}
  *          .uuid {string}
  *          .services {array}
  *          .optionalServices {array} - defaults to all available services, use an empty array to get no optional services
  *
  * @return {object} Returns a new instance of BluetoothDevice
  *
  */
class BluetoothDevice {

  constructor(requestParams) {
    this.requestParams = requestParams;
    this.apiDevice = null;
    this.apiServer = null;
    this.cache = {};
  }

  connected() {
    return this.apiDevice ? this.apiDevice.gatt.connected : errorHandler('no_device');
  }

  /** connect - establishes a connection with the device
    *   
    * NOTE: This method must be triggered by a user gesture to satisfy the native API's permissions
    *
    * @return {object} - native browser API device server object
    */
  connect() {
    const filters = this.requestParams;
    const requestParams = { filters: [], };
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]/;
    
    if(!Object.keys(filters).length) { return errorHandler('no_filters'); }
    if (filters.name) requestParams.filters.push({ name: filters.name });
    if (filters.namePrefix) requestParams.filters.push({ namePrefix: filters.namePrefix });
    if (filters.uuid) {
      if (!filters.uuid.match(uuidRegex)) {
        errorHandler('uuid_error');
      } else {
        requestParams.filters.push({ uuid: filters.uuid });
      }
    }
    if (filters.services) {
      let services = [];
      filters.services.forEach(service => {
        if (!bluetooth.gattServiceList.includes(service)) {
          console.warn(`${service} is not a valid service. Please check the service name.`);
        } else { services.push(service); }
      });
      requestParams.filters.push({ services: services });
    }
    if (filters.optional_services) {
      filters.optional_services.forEach(service => {
        if (!bluetooth.gattServiceList.includes(service)) bluetooth.gattServiceList.push(service);
      });
    } else { requestParams.optionalServices = bluetooth.gattServiceList; }
    
    return navigator.bluetooth.requestDevice(requestParams)
      .then(device => {
        this.apiDevice = device;
        return device.gatt.connect();
      }).then(server => {
        this.apiServer = server;
        return server;
      }).catch(err => {
        return errorHandler('user_cancelled', err);
      });
  }

  /** disconnect - terminates the connection with the device and pauses all data stream subscriptions
    * @return {boolean} - success
    *
    */
  disconnect() {
    this.apiServer.connected ? this.apiServer.disconnect() : errorHandler('not_connected');
    return this.apiServer.connected ? errorHandler('issue_disconnecting') : true;
  }

  /** getValue - reads the value of a specified characteristic
    *
    * @param {string} characteristic_name - GATT characteristic  name
    * @return {promise} -  resolves with an object that includes key-value pairs for each of the properties
    *                       successfully read and parsed from the device, as well as the
    *                       raw value object returned by a native readValue request to the
    *                       device characteristic.
    */
  getValue(characteristic_name) {
    if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
      return errorHandler('characteristic_error', null, characteristic_name);
    }
    
    const characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];

    if (!characteristicObj.includedProperties.includes('read')) {
      console.warn(`Attempting to access read property of ${characteristic_name},
                    which is not a included as a supported property of the
                    characteristic. Attempt will resolve with an object including
                    only a rawValue property with the native API return
                    for an attempt to readValue() of ${characteristic_name}.`);
    }

    return new Promise((resolve, reject) => { return resolve(this._returnCharacteristic(characteristic_name)); })
      .then(characteristic => { return characteristic.readValue(); })
      .then(value => {
        const returnObj = characteristicObj.parseValue ? characteristicObj.parseValue(value) : {};
        returnObj.rawValue = value;
        return returnObj;
      }).catch(err => { return errorHandler('read_error', err); });
  }

  /** writeValue - writes data to a specified characteristic of the device
    *
    * @param {string} characteristic_name - name of the GATT characteristic 
    *     https://www.bluetooth.com/specifications/assigned-numbers/generic-attribute-profile
    *
    * @param {string|number} value - value to write to the requested device characteristic
    *
    *
    * @return {boolean} - Result of attempt to write characteristic where true === successfully written
    */
  writeValue(characteristic_name, value) {
    if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
      return errorHandler('characteristic_error', null, characteristic_name);
    }

    const characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];

    if (!characteristicObj.includedProperties.includes('write')) {
      console.warn(`Attempting to access write property of ${characteristic_name},
                    which is not a included as a supported property of the
                    characteristic. Attempt will resolve with native API return
                    for an attempt to writeValue(${value}) to ${characteristic_name}.`);
    }

    return new Promise((resolve, reject) => { return resolve(this._returnCharacteristic(characteristic_name)); })
      .then(characteristic => { return characteristic.writeValue(characteristicObj.prepValue ? characteristicObj.prepValue(value) : value); })
      .then(changedChar => { return true; })
      .catch(err => { return errorHandler('write_error', err, characteristic_name); });
  }

  /** startNotifications - attempts to start notifications for changes to device values and attaches an event listener for each data transmission
    *
    * @param {string} characteristic_name - GATT characteristic name
    * @param {callback} transmissionCallback - callback function to apply to each event while notifications are active
    *
    * @return
    *
    */
  startNotifications(characteristic_name, transmissionCallback) {
    if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) { return errorHandler('characteristic_error', null, characteristic_name); }

    const characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];
    const primary_service_name = characteristicObj.primaryServices[0];

    if (!characteristicObj.includedProperties.includes('notify')) {
      console.warn(`Attempting to access notify property of ${characteristic_name},
                    which is not a included as a supported property of the
                    characteristic. Attempt will resolve with an object including
                    only a rawValue property with the native API return
                    for an attempt to startNotifications() for ${characteristic_name}.`);
    }

    return new Promise((resolve, reject) => { return resolve(this._returnCharacteristic(characteristic_name)); })
      .then(characteristic => {
        characteristic.startNotifications().then(() => {
          this.cache[primary_service_name][characteristic_name].notifying = true;
          return characteristic.addEventListener('characteristicvaluechanged', event => {
            const eventObj = characteristicObj.parseValue ? characteristicObj.parseValue(event.target.value) : {};
            eventObj.rawValue = event;
            return transmissionCallback(eventObj);
          });
        });
      }).catch(err => { return errorHandler('start_notifications_error', err, characteristic_name); });
  }

  /** stopNotifications - attempts to stop previously started notifications for a provided characteristic
    *
    * @param {string} characteristic_name - GATT characteristic name
    *
    * @return {boolean} success
    *
    */
  stopNotifications(characteristic_name) {
    if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
      return errorHandler('characteristic_error', null, characteristic_name);
    }
    
    const characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];
    const primary_service_name = characteristicObj.primaryServices[0];

    if (this.cache[primary_service_name][characteristic_name].notifying) {
      return new Promise((resolve, reject) => { return resolve(this._returnCharacteristic(characteristic_name)); })
        .then(characteristic => {
          characteristic.stopNotifications().then(() => { 
            this.cache[primary_service_name][characteristic_name].notifying = false;
            return true;
          });
        }).catch(err => {
          return errorHandler('stop_notifications_error', err, characteristic_name);
        });
    } else {
      return errorHandler('stop_notifications_not_notifying', null, characteristic_name);
    }
  }

    /**
      * addCharacteristic - adds a new characteristic object to bluetooth.gattCharacteristicsMapping
      *
      * @param {string} characteristic_name - GATT characteristic name or other characteristic
      * @param {string} primary_service_name - GATT primary service name or other parent service of characteristic
      * @param {array} propertiesArr - Array of GATT properties as Strings
      *
      * @return {boolean} - Result of attempt to add characteristic where true === successfully added
      */
  addCharacteristic(characteristic_name, primary_service_name, propertiesArr) {
    if (bluetooth.gattCharacteristicsMapping[characteristic_name]) {
      return errorHandler('add_characteristic_exists_error', null, characteristic_name);
    }
    
    if (!characteristic_name || characteristic_name.constructor !== String || !characteristic_name.length) {
      return errorHandler('improper_characteristic_format', null, characteristic_name);
    }
    
    if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
      if (!primary_service_name || !propertiesArr) {
        return errorHandler('new_characteristic_missing_params', null, characteristic_name);
      }
      if (primary_service_name.constructor !== String || !primary_service_name.length) {
        return errorHandler('improper_service_format', null, primary_service_name);
      }
      if (propertiesArr.constructor !== Array || !propertiesArr.length) {
        return errorHandler('improper_properties_format', null, propertiesArr);
      }

      console.warn(`${characteristic_name} is not yet fully supported.`);
      
      bluetooth.gattCharacteristicsMapping[characteristic_name] = {
        primaryServices: [primary_service_name],
        includedProperties: propertiesArr,
      };

      return true;
    }
  }

  /**
    * _returnCharacteristic - returns the value of a cached or resolved characteristic or resolved characteristic
    *
    * @param {string} characteristic_name - GATT characteristic name
    * @return {object|false} - the characteristic object, if successfully obtained
    */
  _returnCharacteristic(characteristic_name) {
    if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
      return errorHandler('characteristic_error', null, characteristic_name);
    }

    const characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];
    const primary_service_name = characteristicObj.primaryServices[0];

    if (this.cache[primary_service_name] && this.cache[primary_service_name][characteristic_name] && this.cache[primary_service_name][characteristic_name].cachedCharacteristic) {
      return this.cache[primary_service_name][characteristic_name].cachedCharacteristic;
    } else if (this.cache[primary_service_name] && this.cache[primary_service_name].cachedService) {
      this.cache[primary_service_name].cachedService.getCharacteristic(characteristic_name)
        .then(characteristic => {
          this.cache[primary_service_name][characteristic_name] = { cachedCharacteristic: characteristic };
          return characteristic;
        }).catch(err => { return errorHandler('_returnCharacteristic_error', err, characteristic_name); });
    } else {
      return this.apiServer.getPrimaryService(primary_service_name)
        .then(service => {
          this.cache[primary_service_name] = { 'cachedService': service };
          return service.getCharacteristic(characteristic_name);
        }).then(characteristic => {
            this.cache[primary_service_name][characteristic_name] = { cachedCharacteristic: characteristic };
            return characteristic;
        }).catch(err => {
            return errorHandler('_returnCharacteristic_error', err, characteristic_name);
        });
    }
  }
}

module.exports = BluetoothDevice;
