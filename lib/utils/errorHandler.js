/**
*
*
*/
function errorHandler(error, nativeError, alternateParam) {
	// Big object mapping error codes (keys) to error messages (values)
	const errorMap = {
		add_characteristic_exists_error: `Characteristic ${alternateParam} already exists.`,
		characteristic_error: `Characteristic ${alternateParam} not found. Add ${alternateParam} to device using addCharacteristic or try another characteristic.`,
		connect_gatt: `Error. Could not connect to GATT. Device might be out of range. Also check to see if filters are vaild.`,
		connect_server: `Error. Could not connect to server on device.`,
		connect_service: `Error. Could not find service.`,
		disconnect_timeout: `Timed out. Could not disconnect.`,
		disconnect_error: `Error. Could not disconnect from device.`,
		improper_characteristic_format: `Error. ${alternateParam} is not a properly formatted characteristic.`,
		improper_properties_format: `Error. ${alternateParam} is not a properly formatted properties array.`,
		improper_service_format: `Error. ${alternateParam} is not a properly formatted service.`,
    issue_disconnecting: `Issue disconnecting with device.`,
		new_characteristic_missing_params: `Error. ${alternateParam} is not a fully supported characteristic. Please provide an associated primary service and at least one property.`,
		no_device: `Error. No instance of device found.`,
		no_filters: `No filters found on instance of Device. For more information, please visit http://sabertooth-io.github.io/#method-newdevice`,
		no_read_property: `No read property on characteristic: ${alternateParam}.`,
		no_write_property: `No write property on this characteristic.`,
    not_connected: `Could not disconnect. Device not connected.`,
		parsing_not_supported: `Parsing not supported for characterstic: ${alternateParam}.`,
		postValue_error: `Error. Could not post value to device.`,
		read_error: `Error. Cannot read value on the characteristic.`,
		returnCharacteristic_error: `Error accessing characteristic ${alternateParam}.`,
		start_notifications_error: `Error. Not able to read stream of data from characteristic: ${alternateParam}.`,
		start_notifications_no_notify: `Error. No notify property found on this characteristic: ${alternateParam}.`,
		stop_notifications_not_notifying: `Notifications not established for characteristic: ${alternateParam} or you have not started notifications.`,
		stop_notifications_error: `Issue stopping notifications for characteristic: ${alternateParam} or you have not started notifications.`,
		user_cancelled: `User cancelled the permission request.`,
		uuid_error: `Error. Invalid UUID. For more information on proper formatting of UUIDs, visit https://webbluetoothcg.github.io/web-bluetooth/#uuids`,
		write_error: `Error. Could not change value of characteristic: ${alternateParam}.`,
    write_permissions: `Error. ${alternateParam} characteristic does not have a write property.`
	}
  if(nativeError) {
    throw new Error(`${errorMap[error]} ${nativeError}`);
  }
  else {
    throw new Error(errorMap[error]);
  }
}

module.exports = { errorHandler };
