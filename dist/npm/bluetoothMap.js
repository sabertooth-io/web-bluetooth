'use strict';

var bluetoothMap = {
	gattCharacteristicsMapping: {
		battery_level: {
			primaryServices: ['battery_service'],
			includedProperties: ['read', 'notify'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.battery_level = value.getUint8(0);
				return result;
			}
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
			includedProperties: ['read'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var flags = value.getUint16(0);
				var wheelRevolutionDataSupported = flags & 0x1;
				var crankRevolutionDataSupported = flags & 0x2;
				var multipleSensDataSupported = flags & 0x3;
				var result = {};
				if (wheelRevolutionDataSupported) {
					result.wheel_revolution_data_supported = wheelRevolutionDataSupported ? true : false;
				}
				if (crankRevolutionDataSupported) {
					result.crank_revolution_data_supported = crankRevolutionDataSupported ? true : false;
				}
				if (multipleSensDataSupported) {
					result.multiple_sensors_supported = multipleSensDataSupported ? true : false;
				}
				return result;
			}
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
			includedProperties: ['read', 'write'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.device_name = '';
				for (var i = 0; i < value.byteLength; i++) {
					result.device_name += String.fromCharCode(value.getUint8(i));
				}
				return result;
			},
			prepValue: function prepValue(value) {
				var buffer = new ArrayBuffer(value.length);
				var preppedValue = new DataView(buffer);
				value.split('').forEach(function (char, i) {
					preppedValue.setUint8(i, char.charCodeAt(0));
				});
				return preppedValue;
			}
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
			includedProperties: ['read'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				var flags = value.getUint16(0);
				result.low_battery_detection_supported = flags & 0x1;
				result.sensor_malfunction_detection_supported = flags & 0x2;
				result.sensor_sample_size_supported = flags & 0x4;
				result.sensor_strip_insertion_error_detection_supported = flags & 0x8;
				result.sensor_strip_type_error_detection_supported = flags & 0x10;
				result.sensor_result_highLow_detection_supported = flags & 0x20;
				result.sensor_temperature_highLow_detection_supported = flags & 0x40;
				result.sensor_read_interruption_detection_supported = flags & 0x80;
				result.general_device_fault_supported = flags & 0x100;
				result.time_fault_supported = flags & 0x200;
				result.multiple_bond_supported = flags & 0x400;
				return result;
			}
		},
		http_entity_body: {
			primaryServices: ['http_proxy'],
			includedProperties: ['read', 'write']
		},
		glucose_measurement: {
			primaryServices: ['glucose'],
			includedProperties: ['notify'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var flags = value.getUint8(0);
				var timeOffset = flags & 0x1;
				var concentrationTypeSampleLoc = flags & 0x2;
				var concentrationUnits = flags & 0x4;
				var statusAnnunciation = flags & 0x8;
				var contextInformation = flags & 0x10;
				var result = {};
				var index = 1;
				if (timeOffset) {
					result.time_offset = value.getInt16(index, /*little-endian=*/true);
					index += 2;
				}
				if (concentrationTypeSampleLoc) {
					if (concentrationUnits) {
						result.glucose_concentraiton_molPerL = value.getInt16(index, /*little-endian=*/true);
						index += 2;
					} else {
						result.glucose_concentraiton_kgPerL = value.getInt16(index, /*little-endian=*/true);
						index += 2;
					}
				}
				return result;
			}
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
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var val = value.getUint8(0);
				var result = {};
				switch (val) {
					case 0:
						result.location = 'Other';
					case 1:
						result.location = 'Chest';
					case 2:
						result.location = 'Wrist';
					case 3:
						result.location = 'Finger';
					case 4:
						result.location = 'Hand';
					case 5:
						result.location = 'Ear Lobe';
					case 6:
						result.location = 'Foot';
					default:
						result.location = 'Unknown';
				}
				return result;
			}
		},
		// heart_rate_control_point
		heart_rate_control_point: {
			primaryServices: ['heart_rate'],
			includedProperties: ['write'],
			prepValue: function prepValue(value) {
				var buffer = new ArrayBuffer(1);
				var writeView = new DataView(buffer);
				writeView.setUint8(0, value);
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
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var flags = value.getUint8(0);
				var rate16Bits = flags & 0x1;
				var contactDetected = flags & 0x2;
				var contactSensorPresent = flags & 0x4;
				var energyPresent = flags & 0x8;
				var rrIntervalPresent = flags & 0x10;
				var result = {};
				var index = 1;
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
					var rrIntervals = [];
					for (; index + 1 < value.byteLength; index += 2) {
						rrIntervals.push(value.getUint16(index, /*little-endian=*/true));
					}
					result.rrIntervals = rrIntervals;
				}
				return result;
			}
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
		},
		descriptor_value_changed: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['indicate', 'writeAux', 'extProp']
		},
		apparent_wind_direction: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.apparent_wind_direction = value.getUint16(0) * 0.01;
				return result;
			}
		},
		apparent_wind_speed: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.apparent_wind_speed = value.getUint16(0) * 0.01;
				return result;
			}
		},
		dew_point: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.dew_point = value.getInt8(0);
				return result;
			}
		},
		elevation: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.elevation = value.getInt8(0) << 16 | value.getInt8(1) << 8 | value.getInt8(2);
				return result;
			}
		},
		gust_factor: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.gust_factor = value.getUint8(0) * 0.1;
				return result;
			}
		},
		heat_index: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.heat_index = value.getInt8(0);
				return result;
			}
		},
		humidity: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};

				result.humidity = value.getUint16(0) * 0.01;
				return result;
			}
		},
		irradiance: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};

				result.irradiance = value.getUint16(0) * 0.1;
				return result;
			}
		},
		rainfall: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};

				result.rainfall = value.getUint16(0) * 0.001;
				return result;
			}
		},
		pressure: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.pressure = value.getUint32(0) * 0.1;
				return result;
			}
		},
		temperature: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.temperature = value.getInt16(0) * 0.01;
				return result;
			}
		},
		true_wind_direction: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.true_wind_direction = value.getUint16(0) * 0.01;
				return result;
			}
		},
		true_wind_speed: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.true_wind_speed = value.getUint16(0) * 0.01;
				return result;
			}
		},
		uv_index: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.uv_index = value.getUint8(0);
				return result;
			}
		},
		wind_chill: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.wind_chill = value.getInt8(0);
				return result;
			}
		},
		barometric_pressure_trend: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var val = value.getUint8(0);
				var result = {};
				switch (val) {
					case 0:
						result.barometric_pressure_trend = 'Unknown';
					case 1:
						result.barometric_pressure_trend = 'Continuously falling';
					case 2:
						result.barometric_pressure_trend = 'Continously rising';
					case 3:
						result.barometric_pressure_trend = 'Falling, then steady';
					case 4:
						result.barometric_pressure_trend = 'Rising, then steady';
					case 5:
						result.barometric_pressure_trend = 'Falling before a lesser rise';
					case 6:
						result.barometric_pressure_trend = 'Falling before a greater rise';
					case 7:
						result.barometric_pressure_trend = 'Rising before a greater fall';
					case 8:
						result.barometric_pressure_trend = 'Rising before a lesser fall';
					case 9:
						result.barometric_pressure_trend = 'Steady';
					default:
						result.barometric_pressure_trend = 'Could not resolve to trend';
				}
				return result;
			}
		},
		magnetic_declination: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};

				result.magnetic_declination = value.getUint16(0) * 0.01;
				return result;
			}
		},
		magnetic_flux_density_2D: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				//FIXME: need to find out if these values are stored at different byte addresses
				//       below assumes that values are stored at successive byte addresses
				result.magnetic_flux_density_x_axis = value.getInt16(0, /*little-endian=*/true) * 0.0000001;
				result.magnetic_flux_density_y_axis = value.getInt16(2, /*little-endian=*/true) * 0.0000001;
				return result;
			}
		},
		magnetic_flux_density_3D: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				//FIXME: need to find out if these values are stored at different byte addresses
				//       below assumes that values are stored at successive byte addresses
				result.magnetic_flux_density_x_axis = value.getInt16(0, /*little-endian=*/true) * 0.0000001;
				result.magnetic_flux_density_y_axis = value.getInt16(2, /*little-endian=*/true) * 0.0000001;
				result.magnetic_flux_density_z_axis = value.getInt16(4, /*little-endian=*/true) * 0.0000001;
				return result;
			}
		},
		tx_power_level: {
			primaryServices: ['tx_power'],
			includedProperties: ['read'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.tx_power_level = value.getInt8(0);
				return result;
			}
		},
		weight_scale_feature: {
			primaryServices: ['weight_scale'],
			includedProperties: ['read'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				var flags = value.getInt32(0);
				result.time_stamp_supported = flags & 0x1;
				result.multiple_sensors_supported = flags & 0x2;
				result.BMI_supported = flags & 0x4;
				switch (flags & 0x78 >> 3) {
					case 0:
						result.weight_measurement_resolution = 'Not specified';
					case 1:
						result.weight_measurement_resolution = 'Resolution of 0.5 kg or 1 lb';
					case 2:
						result.weight_measurement_resolution = 'Resolution of 0.2 kg or 0.5 lb';
					case 3:
						result.weight_measurement_resolution = 'Resolution of 0.1 kg or 0.2 lb';
					case 4:
						result.weight_measurement_resolution = 'Resolution of 0.05 kg or 0.1 lb';
					case 5:
						result.weight_measurement_resolution = 'Resolution of 0.02 kg or 0.05 lb';
					case 6:
						result.weight_measurement_resolution = 'Resolution of 0.01 kg or 0.02 lb';
					case 7:
						result.weight_measurement_resolution = 'Resolution of 0.005 kg or 0.01 lb';
					default:
						result.weight_measurement_resolution = 'Could not resolve';
				}
				switch (flags & 0x380 >> 7) {
					case 0:
						result.height_measurement_resolution = 'Not specified';
					case 1:
						result.height_measurement_resolution = 'Resolution of 0.1 meter or 1 inch';
					case 2:
						result.height_measurement_resolution = 'Resolution of 0.005 meter or 0.5 inch';
					case 3:
						result.height_measurement_resolution = 'Resolution of 0.001 meter or 0.1 inch';
					default:
						result.height_measurement_resolution = 'Could not resolve';
				}
				// Remaining flags reserved for future use
				return result;
			}
		},
		csc_measurement: {
			primaryServices: ['cycling_speed_and_cadence'],
			includedProperties: ['notify'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var flags = value.getUint8(0);
				var wheelRevolution = flags & 0x1; //integer = truthy, 0 = falsy
				var crankRevolution = flags & 0x2;
				var result = {};
				var index = 1;
				if (wheelRevolution) {
					result.cumulative_wheel_revolutions = value.getUint32(index, /*little-endian=*/true);
					index += 4;
					result.last_wheel_event_time_per_1024s = value.getUint16(index, /*little-endian=*/true);
					index += 2;
				}
				if (crankRevolution) {
					result.cumulative_crank_revolutions = value.getUint16(index, /*little-endian=*/true);
					index += 2;
					result.last_crank_event_time_per_1024s = value.getUint16(index, /*little-endian=*/true);
					index += 2;
				}
				return result;
			}
		},
		sensor_location: {
			primaryServices: ['cycling_speed_and_cadence'],
			includedProperties: ['read'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var val = value.getUint16(0);
				var result = {};
				switch (val) {
					case 0:
						result.location = 'Other';
					case 1:
						result.location = 'Top of show';
					case 2:
						result.location = 'In shoe';
					case 3:
						result.location = 'Hip';
					case 4:
						result.location = 'Front Wheel';
					case 5:
						result.location = 'Left Crank';
					case 6:
						result.location = 'Right Crank';
					case 7:
						result.location = 'Left Pedal';
					case 8:
						result.location = 'Right Pedal';
					case 9:
						result.location = 'Front Hub';
					case 10:
						result.location = 'Rear Dropout';
					case 11:
						result.location = 'Chainstay';
					case 12:
						result.location = 'Rear Wheel';
					case 13:
						result.location = 'Rear Hub';
					case 14:
						result.location = 'Chest';
					case 15:
						result.location = 'Spider';
					case 16:
						result.location = 'Chain Ring';
					default:
						result.location = 'Unknown';
				}
				return result;
			}
		},
		sc_control_point: {
			primaryServices: ['cycling_speed_and_cadence'],
			includedProperties: ['write', 'indicate'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				return result;
			}
		},
		cycling_power_measurement: {
			primaryServices: ['cycling_power'],
			includedProperties: ['notify'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var flags = value.getUint16(0);
				var pedal_power_balance_present = flags & 0x1;
				var pedal_power_reference = flags & 0x2;
				var accumulated_torque_present = flags & 0x4;
				var accumulated_torque_source = flags & 0x8;
				var wheel_revolution_data_present = flags & 0x10;
				var crank_revolution_data_present = flags & 0x12;
				var extreme_force_magnitude_present = flags & 0x12;
				var extreme_torque_magnitude_present = flags & 0x12;
				var extreme_angles_present = flags & 0x12;
				var top_dead_spot_angle_present = flags & 0x12;
				var bottom_dead_spot_angle_present = flags & 0x12;
				var accumulated_energy_present = flags & 0x12;
				var offset_compensation_indicator = flags & 0x12;
				var result = {};
				var index = 1;
				//Watts with resolution of 1
				result.instantaneous_power = value.getInt16(index);
				index += 2;
				if (pedal_power_reference) {
					//Percentage with resolution of 1/2
					result.pedal_power_balance = value.getUint8(index);
					index += 1;
				}
				if (accumulated_torque_present) {
					//Percentage with resolution of 1/2
					result.accumulated_torque = value.getUint16(index);
					index += 2;
				}
				if (wheel_revolution_data_present) {
					result.cumulative_wheel_revolutions = value.Uint32(index);
					index += 4;
					result.last_wheel_event_time_per_2048s = value.Uint16(index);
					index += 2;
				}
				if (crank_revolution_data_present) {
					result.cumulative_crank_revolutions = value.getUint16(index, /*little-endian=*/true);
					index += 2;
					result.last_crank_event_time_per_1024s = value.getUint16(index, /*little-endian=*/true);
					index += 2;
				}
				if (extreme_force_magnitude_present) {
					//Newton meters with resolution of 1 TODO: units?
					result.maximum_force_magnitude = value.getInt16(index);
					index += 2;
					result.minimum_force_magnitude = value.getInt16(index);
					index += 2;
				}
				if (extreme_torque_magnitude_present) {
					//Newton meters with resolution of 1 TODO: units?
					result.maximum_torque_magnitude = value.getInt16(index);
					index += 2;
					result.minimum_torque_magnitude = value.getInt16(index);
					index += 2;
				}
				if (extreme_angles_present) {
					//TODO: UINT12.
					//Newton meters with resolution of 1 TODO: units?
					// result.maximum_angle = value.getInt12(index);
					// index += 2;
					// result.minimum_angle = value.getInt12(index);
					// index += 2;
				}
				if (top_dead_spot_angle_present) {
					//Percentage with resolution of 1/2
					result.top_dead_spot_angle = value.getUint16(index);
					index += 2;
				}
				if (bottom_dead_spot_angle_present) {
					//Percentage with resolution of 1/2
					result.bottom_dead_spot_angle = value.getUint16(index);
					index += 2;
				}
				if (accumulated_energy_present) {
					//kilojoules with resolution of 1 TODO: units?
					result.accumulated_energy = value.getUint16(index);
					index += 2;
				}
				return result;
			}
		}
	},
	gattServiceList: ['alert_notification', 'automation_io', 'battery_service', 'blood_pressure', 'body_composition', 'bond_management', 'continuous_glucose_monitoring', 'current_time', 'cycling_power', 'cycling_speed_and_cadence', 'device_information', 'environmental_sensing', 'generic_access', 'generic_attribute', 'glucose', 'health_thermometer', 'heart_rate', 'human_interface_device', 'immediate_alert', 'indoor_positioning', 'internet_protocol_support', 'link_loss', 'location_and_navigation', 'next_dst_change', 'phone_alert_status', 'pulse_oximeter', 'reference_time_update', 'running_speed_and_cadence', 'scan_parameters', 'tx_power', 'user_data', 'weight_scale']
};

module.exports = bluetoothMap;