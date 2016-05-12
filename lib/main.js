const errorHandler = require('errorHandler');

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
			errorHandler('Bluetooth','.acquire', 'no_filters');
		}

		const apiDevice = navigator.bluetooth.requestDevice(requestParams);

		return new Device(apiDevice);
	}
	
}

class Device {
	constructor(apiDevice) {
		this.apiDevice = apiDevice;
		this.apiServer = null;
		this.connected = apiDevice.connected;
	}

	connect() {
		this.apiServer = this.apiDevice.gatt.connect();
		this.connected = this.apiDevice.gatt.connected;
		// TODO: Add error functionality
	}

	disconnect() {
		// FIXME: Not working
		this.apiDevice.gatt.disconnect();
	}

};

module.exports = { Bluetooth };