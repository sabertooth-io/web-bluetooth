const errorHandler = require('./errorHandler');

const Bluetooth = {

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
		const servicesList = ['alert_notification','automation_io','battery_service','blood_pressure',
                          'body_composition','bond_management','continuous_glucose_monitoring',
                          'current_time','cycling_power','cycling_speed_and_cadence','device_information',
                          'environmental_sensing','generic_access','generic_attribute','glucose',
                          'health_thermometer','heart_rate','human_interface_device',
                          'immediate_alert','indoor_positioning','internet_protocol_support','link_loss',
                          'location_and_navigation','next_dst_change','phone_alert_status',
                          'pulse_oximeter','reference_time_update','running_speed_and_cadence',
                          'scan_parameters','transport_discovery','tx_power','user_data','weight_scale'
                          ];
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
			else requestParams.optionalServices = servicesList;
		} else {
			/* 
			* If no filters are passed in, throw error no_filters
			*	TODO: Catch error for "user canceled request device chooser"
			*					and "bluetooth not available"
			*/
			errorHandler('no_filters'/*, Context Object */);
		}

		return new Device(navigator.bluetooth.requestDevice(requestParams));
	}
	
}

class Device {
	constructor(apiDevice) {
		this.apiDevice = apiDevice;
		this.apiServer = null;
		this.connected = apiDevice.connected;
		this.distance = this.getDistance();	// in meters
		this.services = null; // FIXME: Add service objects
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
		this.apiDevice.gatt.connect().then(server =>
			this.apiServer = server;
		);
		this.connected = this.apiDevice.gatt.connected;
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

			// If not disconnected within 1s, reject promise
			setTimeout(() => {
				if (this.apiDevice.gatt.connected) {
					errorHandler('disconnect_timeout', {});
					reject(false);
				} else {
					this.apiServer = null;
					resolve(true);
				}
			}, 1000);

			/** 
			 * If the device is connected, attempt to disconnect
			 * then immediately check if successful and resolve promise
			 */
			if (this.apiDevice.gatt.connected) {
				this.apiDevice.gatt.disconnect()
				.then(() => {
					if (!this.apiDevice.gatt.connected) {
						this.apiServer = null;
						resolve(true);
					};
				})
				.catch(err => {
					errorHandler('disconnect_error', {}, err);
				});
			}
		});
	}

	// getDistance() {
	// 	let rssi = this.apiServer.device.adData.rssi;
	// 	let txPower = this.apiServer.device.adData.txPower;
	// 	/**
	// 		* If !rssi, don't divide by zero, just return -1.
	// 		* TODO: Add error functionality
	// 		* FIXME: AWFUL use of ternary
	// 		*/
	// 	let ratio = rssi ? (rssi / txPower) : return -1;

	// 	/**
	// 		* FIXME: How does this work? This method's code is ugly and needs
	// 		*				 refactoring, badly.
	// 	 */
	// 	let accuracy = 0.89976 * Math.pow(ratio, 7.7095) + 0.111;

	// 	if (ratio < 1){
	// 		return Math.pow(ratio, 10);
	// 	} else {
	// 		return accuracy;
	// 	}
	// }

};

/**
  *
	*
	*/
class Service {
	constructor() {

	}
}

/**
  *
	*
	*/
class BatteryService extends Service {
	constructor() {
		// Cache values? How does the underlying API work?
	}

}

module.exports = { Bluetooth };