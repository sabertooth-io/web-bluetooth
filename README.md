# web-bluetooth

[![npm version](https://badge.fury.io/js/web-bluetooth.svg)](https://badge.fury.io/js/web-bluetooth)
[![pull requests welcomed](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]

### A Javascript Library for interacting with Bluetooth Low Energy Devices.

##### Bridging the gap between the web and the physical world through Bluetooth.

Previously, interacting with Bluetooth devices was limited to native applications. Access to connect, read, and write from Bluetooth devices is now made available to web applications thanks to the Web Bluetooth API and modern web browsers like Chrome and Firefox, Opera who are incresingly adding support for new features in the Web Bluetooth API Spec.

### Overview

Web-bluetooth is a configurable application framework for integrating bluetooth functionality with client-side Javascript.

### Getting Started

Web-Bluetooth (currently v1.0.0) has a few easy ways to quickly get started, each one appealing to your preferences.

#### Download

You can install web-bluetooth by downloading our minified library [here](https://github.com/sabertooth-io/web-bluetooth/archive/master.zip)

Make the library available by referencing it in your index.html file.

```
<script>/lib/web-bluetooth.js</script>
```

#### Install with npm

You can install web-bluetooth with [npm](https://npmjs.com/package/web-bluetooth)

Require('web-bluetooth') will load all of the files necessary to run our library.

```
$ npm install web-bluetooth
```

### General Accesibility

While the Web Bluetooth API is still in development, features have been made available. This library has made available several important features to develop web applications using Bluetooth connections.

> Note: The Web Bluetooth API is still in development and many features have not been implemented across browsers. For the current status of the API, please follow this [link](https://webbluetoothcg.github.io/web-bluetooth/).

|  Feature   |      ChromeOS      | Android Mobile  |  MacOSX  |
|:----------|:------------------:|:---------------:|:---------:|
| Device Discovery | ✓ | ✓ | ✓ |
| Device Connecting | ✓ | ✓ | ✓ |
| Device Disconnecting | ✓ | ✓ | ✓ |
| Device Services Read | ✓ | ✓ |

### GATT Services Support

Services are collections of characteristics and relationships to other services that encapsulate the behavior of part of a device. For example, the “Battery Service” exposes the Battery Level of a device broadcasting the “Battery Service” service.

This library abstracts over core GATT Service types with special attention to service types that are common and that are most applicable in this current stage of Bluetooth device availability.

For the full list of normative Services click [here](https://webbluetoothcg.github.io/web-bluetooth/). As the Web Bluetooth API continues to be developed and as this library matures, more service types will be made available.

|  Service   |      Supported      | Spec Type  |  Assigned Number  |
|:----------|:------------------:|:---------------:|:---------:|
| Alert Notification |  |  'alert-notification' | 0x1811 |
| Battery Service | ✓ | 'battery_service' | 0x180F |
| Blood Pressure |  | 'blood_pressure' | 0x1810 |
| Cycling Power |  | 'cycling_power' | 0x1818 |
| Cycling Speed and Cadence |  | 'cycling_speed_and_cadence' | 0x1816 |
| Device Info | ✓ | 'device_information' | 0x180A |
| Generic Access | ✓ | 'generic_access' | 0x1800 |
| Generic Attribute | ✓ | 'generic_attribute' | 0x1801 |
| Health Thermometer |  | 'health-thermometer' | 0x1809 |
| Heart Rate | ✓ | 'health-heart_rate' | 0x180D |
| Running Speed and Cadence |  | 'running_speed_and_cadence' | 0x1814 |
| Tx Power | ✓ | 'tx_power' | 0x1804 |

### General Methods Provided by Library

#### Create a New Bluetooth Device Object

Before calling methods on your Bluetooth device, create a new Bluetooth device object.

```
var fitbit = new Device({
  namePrefix: 'Surge'
  services: ['battery_service']
});
```

In the example above, we have created a new Bluetooth device object titled 'blue' by requesting the object with it's 'namePrefix' and a service of 'battery service'.
Device is a constructor that takes in an object corresponding to attributes on the bluetooth device. Below is a schema for what can be used to connect to a device. At least one option is needed to request a device.

```
{
  name: 'device_name',
  namePrefix: 'devicePrefix',
  uuid: 'uuid',
  service: 'service'
}
```

`'name':` is the name (hardware) of the device

`'namePrefix':` looks for a name starting with namePrefix

`'services':` represents a 128-bit UUID. A valid UUID is a string that matches the regexp '/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/'

`'uuid':` collection of characteristics and the relationships to other services encapsulate the behavior of part of a device

#### .connect()

Method allows you to establish a persistent connection with a Bluetooth device.

```
fitbit.connect(connectedDevice,(server) => {
  connectedDevice = device;
};
```

#### .disconnect()

Method disconnects you from the device.

```
fitbit.disconnect();
```

#### .getValue('characteristic')

Method reads the value from the device you are connected to by passing in the characteristic as a string.

```
fitbit
  .getValue('battery_level')
    .then(value => {
      console.log(value);
    });
```

In the above example, .getValue() returns the current battery level as a percentage from 0% to 100%; 0% represents a battery that is fully discharged, 100% represents a battery that is fully charged.

### Demo

#### Battery Service
This demo uses the Web-Bluetooth library to connect to a device broadcasting a Battery Service characteristic and reads it's level.

[View the demo.](https://demo-battery-service.herokuapp.com/) | [Visit the GitHub page.](https://github.com/sabertooth-io/demo-battery_service)

Notes:
• Requires Android 6.0 Marshmallow, ChromeOS or Chrome for Linux.
• Enable the 'Web Bluetooth' flag.

### Authors and Contributors

Sabertooth is a team of four software developers enthusiastic to be contributing to the open source community. Visit their GitHub page for more information.
