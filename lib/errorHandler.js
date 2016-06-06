/** errorHandler - Consolodates error message configuration and logic
*
* @param {string} errorKey - maps to a detailed error message
* @param {object} nativeError - the native API error object, if present
* @param {} alternate - 
*
*/
function errorHandler(errorKey, nativeError, alternate) {

	const errorMessages = {
		add_characteristic_exists_error: `Characteristic ${alternate} already exists.`,
		characteristic_error: `Characteristic ${alternate} not found. Add ${alternate} to device using addCharacteristic or try another characteristic.`,
		connect_gatt: `Could not connect to GATT. Device might be out of range. Also check to see if filters are vaild.`,
		connect_server: `Could not connect to server on device.`,
		connect_service: `Could not find service.`,
		disconnect_timeout: `Timed out. Could not disconnect.`,
		disconnect_error: `Could not disconnect from device.`,
		improper_characteristic_format: `${alternate} is not a properly formatted characteristic.`,
		improper_properties_format: `${alternate} is not a properly formatted properties array.`,
		improper_service_format: `${alternate} is not a properly formatted service.`,
    issue_disconnecting: `Issue disconnecting with device.`,
		new_characteristic_missing_params: `${alternate} is not a fully supported characteristic. Please provide an associated primary service and at least one property.`,
		no_device: `No instance of device found.`,
		no_filters: `No filters found on instance of Device. For more information, please visit http://sabertooth.io/#method-newdevice`,
		no_read_property: `No read property on characteristic: ${alternate}.`,
		no_write_property: `No write property on this characteristic.`,
    not_connected: `Could not disconnect. Device not connected.`,
		parsing_not_supported: `Parsing not supported for characterstic: ${alternate}.`,
		read_error: `Cannot read value on the characteristic.`,
		_returnCharacteristic_error: `Error accessing characteristic ${alternate}.`,
		start_notifications_error: `Not able to read stream of data from characteristic: ${alternate}.`,
		start_notifications_no_notify: `No notify property found on this characteristic: ${alternate}.`,
		stop_notifications_not_notifying: `Notifications not established for characteristic: ${alternate} or you have not started notifications.`,
		stop_notifications_error: `Issue stopping notifications for characteristic: ${alternate} or you have not started notifications.`,
		user_cancelled: `User cancelled the permission request.`,
		uuid_error: `Invalid UUID. For more information on proper formatting of UUIDs, visit https://webbluetoothcg.github.io/web-bluetooth/#uuids`,
		write_error: `Could not change value of characteristic: ${alternate}.`,
    write_permissions: `${alternate} characteristic does not have a write property.`
	}
  
  throw new Error(errorMessages[errorKey]);
  return false;
}

module.exports = errorHandler;
