export Bluetooth = {
	gattCharacteristicsMapping: {

		// battery_level characteristic
		battery_level: {
			primaryServices: ['battery_service'],
			includedProperties: ['read', 'notify'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				result.battery_level = value.getUint8(0);
				return result;
			}
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
			includedProperties: ['read', 'write'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				result.device_name = '';
				for(var i=0; i<value.byteLength; i++){
					result.device_name+= String.fromCharCode(value.getUint8(i));
				}
				return result;
			},
			prepValue: value => {
				// TODO: determine max eligible byte length based on characteristic payload
				let buffer = new ArrayBuffer(value.length);
				let preppedValue = new DataView(buffer);
				value.split('').forEach((char, i)=>{
					preppedValue.setUint8(i, char.charCodeAt(0));
				})
				return preppedValue;
			}
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
			includedProperties: ['read'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				let flags = value.getUint16(0);
				let result.low_battery_detection_supported = flags & 0x1;
				let result.sensor_malfunction_detection_supported = flags & 0x2;
				let result.sensor_sample_size_supported = flags & 0x4;
				let result.sensor_strip_insertion_error_detection_supported = flags & 0x8;
				let result.sensor_strip_type_error_detection_supported = flags & 0x10;
				let result.sensor_result_highLow_detection_supported = flags & 0x20;
				let result.sensor_temperature_highLow_detection_supported = flags & 0x40;
				let result.sensor_read_interruption_detection_supported = flags & 0x80;
				let result.general_device_fault_supported = flags & 0x100;
				let result.time_fault_supported = flags & 0x200;
				let result.multiple_bond_supported = flags & 0x400;
				// Remaining flags reserved for future use
				return result;
			}
		},
		//http_entity_body characteristic
		http_entity_body: {
			primaryServices: ['http_proxy'],
			includedProperties: ['read', 'write']
		},
		glucose_measurement: {
			primaryServices: ['glucose'],
			includedProperties: ['notify'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let flags = value.getUint8(0);
				let timeOffset = flags & 0x1;
				let concentrationTypeSampleLoc = flags & 0x2;
				let concentrationUnits = flags & 0x4;
				let statusAnnunciation = flags & 0x8;
				let contextInformation = flags & 0x10;
				let result = {};
				let index = 1;

				// FIXME: THIS PARSING METHOD INCOMPLETE!!! AP TO FINISH!!!
				if (timeOffset) {
					result.time_offset = value.getInt16(index, /*little-endian=*/true);
					index += 2;
				}
				if (concentrationTypeSampleLoc){
					if(concentrationUnits){
						// FIXME: CURRENTLY GETTING SIGNED INT 16, NEED SIGNED FLOAT 16
						result.glucose_concentraiton_molPerL = value.getInt16(index, /*little-endian=*/true )
						index += 2;
					}
					else {
						// FIXME: CURRENTLY GETTING SIGNED INT 16, NEED SIGNED FLOAT 16
						result.glucose_concentraiton_kgPerL = value.getInt16(index, /*little-endian=*/true )
						index += 2;
					}
				}

				return result;
			}
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
				value = value.buffer ? value : new DataView(value);
				let val = value.getUint8(0);
				let result = {};
				switch (val) {
					case 0: result.location = 'Other';
					case 1: result.location = 'Chest';
					case 2: result.location = 'Wrist';
					case 3: result.location = 'Finger';
					case 4: result.location = 'Hand';
					case 5: result.location = 'Ear Lobe';
					case 6: result.location = 'Foot';
					default: result.location = 'Unknown';
				}
				return result;
			}
		},
		// heart_rate_control_point
		heart_rate_control_point: {
			primaryServices: ['heart_rate'],
			includedProperties: ['write'],
			prepValue: value => {
				let buffer = new ArrayBuffer(1);
				let writeView = new DataView(buffer);
				writeView.setUint8(0,value);
				return writeView;
			}
		},
		heart_rate_measurement: {
			primaryServices: ['heart_rate'],
			includedProperties: ['notify'],
			/**
				* Parses the event.target.value object and returns object with readable
				* key-value pairs for all advertised characteristic values
				*
				*	@param {Object} value Takes event.target.value object from startNotifications method
				*
				* @return {Object} result Returns readable object with relevant characteristic values
				*
				*/
			parseValue: value => {
				// In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
				value = value.buffer ? value : new DataView(value);
				// Reads first byte and determines which value fields are present based on flags
				let flags = value.getUint8(0);
				let rate16Bits = flags & 0x1;
				let contactDetected = flags & 0x2;
				let contactSensorPresent = flags & 0x4;
				let energyPresent = flags & 0x8;
				let rrIntervalPresent = flags & 0x10;
				// Object to store values to be returned to startNotifications method
				let result = {};
				// Iterate over DataView to retrieve values at each index where values are present
				let index = 1;

				// heartRate can be advertised in either 8- or 16-bit format
				// increment index accordingly to provide correct address for retriving next possible value
				if (rate16Bits) {
					result.heartRate = value.getUint16(index, /*little-endian=*/true);
					index += 2;
				} else {
					result.heartRate = value.getUint8(index);
					index += 1;
				}
				if (contactSensorPresent) {
					result.contactDetected = !!contactDetected;
				}
				if (energyPresent) {
					result.energyExpended = value.getUint16(index, /*little-endian=*/true);
					index += 2;
				}
				if (rrIntervalPresent) {
					let rrIntervals = [];
					for (; index + 1 < value.byteLength; index += 2) {
						rrIntervals.push(value.getUint16(index, /*little-endian=*/true));
					}
					result.rrIntervals = rrIntervals;
				}
				return result;
			}
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
		//environmental_sensing
		//FIXME: explore indications, writeAux, extProp and how to access
		descriptor_value_changed: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['indicate', 'writeAux', 'extProp'],
		},
		apparent_wind_direction: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				// TODO: test decimal resolution, -2 per protocol docs
				// FIXME: docs do not specify Endianness of values stored... assumed to be big-endian
				result.apparent_wind_direction = value.getUint16(0) * 0.01;
				return result;
			}
		},
		apparent_wind_speed: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				// TODO: test decimate resolution, -2 per protocol docs
				// FIXME: docs do not specify Endianness of values stored... assumed to be big-endian
				result.apparent_wind_speed = value.getUint16(0) * 0.01;
				return result;
			}
		},
		dew_point: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				result.dew_point = value.getInt8(0);
				return result;
			}
		},
		elevation: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				// elevation is a sint24, for which there is no native DataView prototype method
				// FIXME: docs do not specify Endianness of values stored... assumed to be big-endian
				result.elevation = value.getInt8(0) << 16 | value.getInt8(1) << 8 | value.getInt8(2);
				return result;
			}
		},
		gust_factor: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				result.gust_factor = value.getUint8(0) * 0.1;
				return result;
			}
		},
		heat_index: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				result.heat_index = value.getInt8(0);
				return result;
			}
		},
		humidity: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				// FIXME: docs do not specify Endianness of values stored... assumed to be big-endian
				result.humidity = value.getUint16(0) * 0.01;
				return result;
			}
		},
		irradiance: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				// FIXME: docs do not specify Endianness of values stored... assumed to be big-endian
				result.irradiance = value.getUint16(0) * 0.1;
				return result;
			}
		},
		rainfall: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				// FIXME: docs do not specify Endianness of values stored... assumed to be big-endian
				result.rainfall = value.getUint16(0) * 0.001;
				return result;
			}
		},
		pressure: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				// FIXME: docs do not specify Endianness of values stored... assumed to be big-endian
				result.pressure = value.getUint32(0) * 0.1;
				return result;
			}
		},
		temperature: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				// FIXME: docs do not specify Endianness of values stored... assumed to be big-endian
				result.temperature = value.getInt16(0) * 0.01;
				return result;
			}
		},
		true_wind_direction: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				// FIXME: docs do not specify Endianness of values stored... assumed to be big-endian
				result.true_wind_direction = value.getUint16(0) * 0.01;
				return result;
			}
		},
		true_wind_speed: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				// FIXME: docs do not specify Endianness of values stored... assumed to be big-endian
				result.true_wind_speed = value.getUint16(0) * 0.01;
				return result;
			}
		},
		uv_index: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				result.uv_index = value.getUint8(0);
				return result;
			}
		},
		wind_chill: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				result.wind_chill = value.getInt8(0);
				return result;
			}
		},
		barometric_pressure_trend: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let val = value.getUint8(0);
				let result = {};
				switch (val) {
					case 0: result.barometric_pressure_trend = 'Unknown';
					case 1: result.barometric_pressure_trend = 'Continuously falling';
					case 2: result.barometric_pressure_trend = 'Continously rising';
					case 3: result.barometric_pressure_trend = 'Falling, then steady';
					case 4: result.barometric_pressure_trend = 'Rising, then steady';
					case 5: result.barometric_pressure_trend = 'Falling before a lesser rise';
					case 6: result.barometric_pressure_trend = 'Falling before a greater rise';
					case 7: result.barometric_pressure_trend = 'Rising before a greater fall';
					case 8: result.barometric_pressure_trend = 'Rising before a lesser fall';
					case 9: result.barometric_pressure_trend = 'Steady';
					default: result.barometric_pressure_trend = 'Could not resolve to trend';
				}
				return result;
			}
		},
		magnetic_declination: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				// FIXME: docs do not specify Endianness of values stored... assumed to be big-endian
				result.magnetic_declination = value.getUint16(0) * 0.01;
				return result;
			}
		},
		magnetic_flux_density_2D: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				//FIXME: need to find out if these values are stored at different byte addresses
				//       below assumes that values are stored at successive byte addresses
				result.magnetic_flux_density_x_axis = value.getInt16(0,/*little-endian=*/ true) * 0.0000001;
				result.magnetic_flux_density_y_axis = value.getInt16(2,/*little-endian=*/ true) * 0.0000001;
				return result;
			}
		},
		magnetic_flux_density_3D: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify','writeAux', 'extProp'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				//FIXME: need to find out if these values are stored at different byte addresses
				//       below assumes that values are stored at successive byte addresses
				result.magnetic_flux_density_x_axis = value.getInt16(0,/*little-endian=*/ true) * 0.0000001;
				result.magnetic_flux_density_y_axis = value.getInt16(2,/*little-endian=*/ true) * 0.0000001;
				result.magnetic_flux_density_z_axis = value.getInt16(4,/*little-endian=*/ true) * 0.0000001;
				return result;
			}
		},
		tx_power_level: {
			primaryServices: ['tx_power'],
			includedProperties: ['read'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				result.tx_power_level = value.getInt8(0);
				return result;
			}
		},
		weight_scale_feature: {
			primaryServices: ['weight_scale'],
			includedProperties: ['read'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);
				let result = {};
				let flags = value.getInt32(0);
				let result.time_stamp_supported = flags & 0x1;
				let result.multiple_sensors_supported = flags & 0x2;
				let result.BMI_supported = flags & 0x4;
				switch (flags & 0x78 >> 3) {
					case 0: result.weight_measurement_resolution = 'Not specified';
					case 1: result.weight_measurement_resolution = 'Resolution of 0.5 kg or 1 lb';
					case 2: result.weight_measurement_resolution = 'Resolution of 0.2 kg or 0.5 lb';
					case 3: result.weight_measurement_resolution = 'Resolution of 0.1 kg or 0.2 lb';
					case 4: result.weight_measurement_resolution = 'Resolution of 0.05 kg or 0.1 lb';
					case 5: result.weight_measurement_resolution = 'Resolution of 0.02 kg or 0.05 lb';
					case 6: result.weight_measurement_resolution = 'Resolution of 0.01 kg or 0.02 lb';
					case 7: result.weight_measurement_resolution = 'Resolution of 0.005 kg or 0.01 lb';
					default: result.weight_measurement_resolution = 'Could not resolve';
				}
				switch (flags & 0x380 >> 7) {
					case 0: result.height_measurement_resolution = 'Not specified';
					case 1: result.height_measurement_resolution = 'Resolution of 0.1 meter or 1 inch';
					case 2: result.height_measurement_resolution = 'Resolution of 0.005 meter or 0.5 inch';
					case 3: result.height_measurement_resolution = 'Resolution of 0.001 meter or 0.1 inch';
					default: result.height_measurement_resolution = 'Could not resolve';
				}
				// Remaining flags reserved for future use
				return result;
			}
		},
		csc_measurement: {
			primaryServices: ['cycling_speed_and_cadence'],
			includedProperties: ['notify'],
			parseValue: value => {
				value = value.buffer ? value : new DataView(value);

				let flags = value.getUint8(0);
				let wheelRevolution = flags & 0x1;
				let crankRevolution = flags & 0x2;

				let index = 1;

				if(wheelRevolution) {
					result.cumulative_wheel_revolutions =
				}

				let result = {};
				result.tx_power_level = value.getInt8(0);
				return result;
			}
		},
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
}
