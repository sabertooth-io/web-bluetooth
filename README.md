# web-bluetooth

[![npm version](https://badge.fury.io/js/web-bluetooth.svg)](https://badge.fury.io/js/web-bluetooth)
![pull requests welcomed](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

### Library for interacting with Bluetooth 4.0 devices through the browser.

Connect, read, and write to Bluetooth devices in web applications using only a few lines of Javascript.

### Getting Started

Web-bluetooth (aka Sabertooth) has a few easy ways to quickly get started, each one appealing to your preferences.

#### Install with npm

You can install Sabertooth as the npm package 'web-bluetooth' [here](https://npmjs.com/package/web-bluetooth).

Or run the command-line script below in the project directory in which you would like to use Sabertooth.
```
$ npm install web-bluetooth
```
The following will load all of the files necessary to run Sabertooth.

`require('web-bluetooth')`

### General Accesibility

While the Web Bluetooth API is still in development, certain features have been made available.

> Note: The functionality of Sabertooth is contingent upon the permissions and availabilities of the Web Bluetooth API. The Web Bluetooth API is still in development and many features have not been implemented across browsers. For the current status of the API, please follow this [link](https://webbluetoothcg.github.io/web-bluetooth/).

|  Feature   |      ChromeOS      | Android Mobile  |  MacOSX  |
|:----------|:------------------:|:---------------:|:---------:|
| Device Discovery | ✓ | ✓ | ✓ |
| Device Connecting | ✓ | ✓ | ✓ |
| Device Disconnecting | ✓ | ✓ | ✓ |
| Device Services Read | ✓ | ✓ |

> Note: To enable the browser to use the Web Bluetooth API (and Sabertooth), experimental flags must be enabled and an https server are required.

### GATT Attributes

A basic understanding of the [Generic Attribute Profile (GATT)](https://developer.bluetooth.org/TechnologyOverview/Pages/GATT.aspx) is helpful when writing applications to interact with Bluetooth devices, but using Sabertooth requires an understanding of two main GATT attributes, GATT services and GATT characteristics.

Services are collections of characteristics and relationships to other services that encapsulate the behavior of part of a device. For example, the “Battery Service” exposes the Battery Level of a device broadcasting the “Battery Service” service.

Sabertooth abstracts over the core features of the Web-Bluetooth API, and allows for the use of virtually any GATT service or GATT characteristic, as well as non-GATT services and non-GATT characteristics.

For the complete list of normative GATT services click [here](https://webbluetoothcg.github.io/web-bluetooth/). As the Web Bluetooth API continues to be developed and as this library matures, full support for more service types will be made available.

#### Creating a New Bluetooth Device

##### `new BluetoothDevice(filters)`

To begin interacting with a Bluetooth device, create a new instance of BluetoothDevice and save the result to a variable. BluetoothDevice is a constructor that takes in an object filters containing attributes advertised by the Bluetooth device.

##### Parameters
`filters` - an object containing at least one valid filter corresponding to attributes advertised by the bluetooth device through which Sabertooth will attempt to request and connect to the device. Below is a schema representing the optional parameters that can be passed into the `BluetoothDevice` constructor to create a new `BluetoothDevice` instance. At least one of the key-value pairs below is needed to request a device and establish an initial connection.

> Note: Parameters passed into the `filters` object of the `BluetoothDevice` constructor are inclusive; a request and connection to a device can only succeed if the device satisfies all of the provided filters.

```
{
  name: 'device_name',
  namePrefix: 'devicePrefix',
  uuid: 'uuid',
  service: 'service'
}
```
`name` - the advertised the name of the device; often set by the manufacturer unless modified by the device user

`namePrefix` - an initial substring of any length that matches an advertised device name

`uuid` - represents a 128-bit universally unique identifier (uuid). A valid uuid is a string that matches the regexp /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

`services` - an array including at least one service being advertised by the device.

> Note: Not all services present on a device are advertised. Attempting to access a device by including a filter for a service present on a device but not being advertised by the device will cause the request to the device to fail.

##### Returns
A new `BluetoothDevice` instance on which Sabertooth methods can be called.
##### Example

```
var exampleDevice = new BluetoothDevice({
  namePrefix: 'Surge'
});
```
In the example above, a new BluetoothDevice instance exampleDevice has been created with a valid request filter. The device name is one of the many properties advertised by Bluetooth devices and serves as a possible identifier for establishing initial connections to the device. In this example, the device name will act as the provided filter.

Below are several other examples of ways in which a new BluetoothDevice instance can be created using different filters or combinations of filters.
```
/* Attempts to request a device advertising a name
 * beginning with the substring 'Po'
 */
var exampleDevice = new BluetoothDevice({
  namePrefix: 'Po'
});
```
```
/* Attempts to request a device advertising the name
 * 'Polar H7 Heart Rate Sensor' and ALSO advertising the
 * GATT service 'heart_rate'
 */
var exampleDevice = new BluetoothDevice({
  name: 'Polar H7 Heart Rate Sensor'
  service: ['heart_rate']
});
```
---
#### General Methods
##### `.connect()`

Method establishes a persistent connection with a Bluetooth device.
##### Parameters
None
##### Returns
A Promise to the device GATT server for the connected device.
##### Example
```
exampleDevice.connect();
```
In the example above, a connection to a previously created BluetoothDevice instance named exampleDevice will be attempted.

---

##### `.disconnect()`

Method removes a previous connection with a Bluetooth device.
##### Parameters
None
##### Returns
A boolean representing the success of the attempt to disconnect from the device where true represents success.
##### Example
```
exampleDevice.disconnect();
```
---
##### `.connected()`

Method returns the current connection status of the device.

##### Parameters
None
##### Returns
A boolean representing the success of the attempt to disconnect from the device where true is connected and false is disconnected.

##### Example
```
exampleDevice.connected();
```
In the example above, an attempt will be made to check the connection status of a previously created `BluetoothDevice` instance named `exampleDevice`.

---
##### `.getValue(characteristic)`

Method attempts to read the value of provided characteristic from a connected `BluetoothDevice` instance.


##### Parameters
`characteristic` - a GATT characteristic or 128-bit uuid string that resolves to a characteristic accessible on the device.


##### Returns
An object containing the [ArrayBuffer](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor) value read from the connected `BluetoothDevice` instance, saved to the key `.rawValue`. For characteristics fully supported by Sabertooth, the return object will also include any parsed values for available descriptors of the requested characteristic as key-vlaue pairs with the descriptor as the key and the parsed value as the value.



##### Example
```
exampleDevice.getValue('battery_level')
             .then(value => {
                console.log(value.battery_level);
             });
```
In the above example, the `.getValue()` method is called on the `BluetoothDevice` instance exampleDevice, which returns an object, in this example referenced as `value`. `value` contains the ArrayBuffer returned from the device stored to the property `rawValue`, and because `'battery_level'` is a fully supported characteristic in Sabertooth, value also contains the parsed integer value for the instance's battery level, stored on the value object as the key `battery_level`. In this example, the parsed integer value representing the device's battery level is being logged to the console.

---
##### `.writeValue(characteristic, value)`

Method takes a characteristic and value and attempts to write the provided value to the provided characteristic on the device.

##### Parameters
`characteristic` - a GATT characteristic or 128-bit uuid string that resolves to a characteristic accessible on the device instance.

`value` - an ArrayBuffer or DataView


##### Returns
A boolean representing the success of the attempt to write to the provided characteristic where true represents success.



##### Example
```
exampleDevice.writeValue('gap.device_name', 'myFitbit' )
      .then(writeSuccess => {
        console.log(writeSuccess);
      });
```
In the above example, `.writeValue()` changes the name of the instantiated device to myFitbit.

---
##### `.startNotifications(characteristic, callback)`

Method takes a characteristic name and a callback function. Provided that the characteristic has a 'notify' property, .startNotifications() will pass the event object broadcasted by the characteristic as the parameter of the callback, and run the callback each time a new event occurs.

##### Parameters
`characteristic` - a GATT characteristic or 128-bit uuid string that resolves to a characteristic accessible on the device instance.

`callback` - a callback triggered as result of a notification from the provided characteristic advertised by the device. The parameter eventObj will automatically be passed into callback for each notification received from the device.

`eventObj` - an object passed as the sole parameter into the callback provided. `eventObj` contains the ArrayBuffer value notified from the connected `BluetoothDevice` instance, saved to the key `.rawValue`. For characteristics fully supported by Sabertooth, `eventObj` will also include any parsed values for available descriptors of the requested characteristic as key-vlaue pairs with the descriptor as the key and the parsed value as the value.


##### Returns
None.

##### Example
```
exampleDevice.startNotifications('heart_rate_measurement', eventObj => {
    var newHR = eventObj.heart_rate_measurement;
    console.log(newHR);
    });
```
In the above example, the `.startNotifications()` method is called on the `BluetoothDevice` instance exampleDevice, which attempts to initiate a stream of notifications from the Bluetooth device, where the provided `callback`, in this example an anonymous function with the parameter `eventObj`, will be applied to the `eventObj` returned from each notification from the device. In this example, `eventObj` contains the ArrayBuffer returned from the device notification, stored to the property `rawValue`, and because `'heart_rate_measurement'` is a fully supported characteristic in Sabertooth, `eventObj` also contains the parsed integer value for the device's heart rate measurement, stored on the `eventObj` object as the key `heart_rate_measurement`. In this example, the parsed integer value representing the notification's heart rate measurement is being logged to the console.

---
##### `.stopNotifications(characteristic)`

This method stops the notifications from the provided characteristic for the `BluetoothDevice` instance.



##### Parameters
None.


##### Returns
None.

##### Example
```
exampleDevice.stopNotifications('heart_rate_measurement');
```
In the above example, the `.stopNotifications()` method is called on the `BluetoothDevice` instance `exampleDevice`, which attempts to end a stream of notifications from the Bluetooth device.

---
##### `.addCharacteristic(characteristic, service, properties)`

This method adds Sabertooth support for the provided characteristic to device instance on which the method was called.

##### Parameters
`characteristic` - a GATT characteristic or 128-bit uuid string that resolves to a characteristic accessible on the device instance

`service` - a GATT service or 128-bit uuid string that resolves to a service accessible on the device instance

`properties` - an array containing at least one property existing on the characteristic to be added. Currently, Sabertooth supports the properties 'read', 'write', and 'notify'.

##### Returns
A boolean representing the success of the attempt to add the characteristic to the device instance where true represents success.

> Note: For characteristics added to the device instance, Sabertooth cannot parse values read from the device or prepare values to be written to the device. Returned values from device calls to the .readValue() method will return an object containing the raw data returned from the device; device calls to the .writeValue() method will attempt to write the provided value directly to the device in its provided form.

##### Example
```
exampleDevice.addCharacteristic(
    '9a66fd22-0800-9191-11e4-012d1540cb8e',
    '9a66fd21-0800-9191-11e4-012d1540cb8e',
    ['read','write','notify']);
```
In the above example, the `.addCharacteristic()` method is called on the `BluetoothDevice` instance `exampleDevice`, which returns an object, in this example referenced as value, containing the parsed integer value for the instance's battery level, stored on the value object as the key `battery_level`.

---
### Demos

#### Heart Rate Service
This demo uses the Sabertooth library to connect to a heart rate monitor broadcasting a Heart Rate Service characteristic and reads it's measurement.

[Visit the GitHub page.](https://github.com/sabertooth-io/demo-heart_rate_service)

#### Battery Service
This demo uses the Sabertooth library to connect to a device broadcasting a Battery Service characteristic and reads it's level.

[Visit the GitHub page.](https://github.com/sabertooth-io/demo-battery_service)

> Notes:
• Requires Android 6.0 Marshmallow, ChromeOS or Chrome for Linux.
• Enable the 'Web Bluetooth' flag.

### Authors and Contributors

Sabertooth is a team of four software developers enthusiastic to be contributing to the open source community. Visit their GitHub pages for more information.

Aaron Peltz | [GitHub](https://github.com/apeltz/)

Alex Patch | [GitHub](https://github.com/the-gingerbread-man/)

Carlos Corral | [GitHub](https://github.com/ccorral/)

Daniel Lee | [GitHub](https://github.com/dslee393/)
