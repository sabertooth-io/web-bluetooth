# Sabertooth 
#### Web Bluetooth Library
The first Javascript library for developing web applications that interact with Bluetooth Low Energy Devices.

|  Feature   |      ChromeOS      |  Android Mobile |  Mac OSX  |
|:----------|:------------------:|:---------------:|:---------:|
| Discovery |  ✓ | ✓ |✓  
| Connecting |    ✓   |   ✓ |
| Disconnecting | ✓ |    ✓ | 
| Distance Measurement | ✓ |    ✓ |
| Distance Event | ✓ |    ✓ |
| Read Eddystone URL | ✓ |    ✓ |
| Write Eddystone URL | ✓ |    ✓ |

## Discovery
##### bluetooth.discover(callback)
Method to discover a Bluetooth Low Energy Device.
```javascript
//Discovering a device.
bluetooth.discover((device) => {
    return device;
}
```
*Error*: Error message examples.

## Connecting
##### bluetooth.connect(name, callback)
Method to connect to a Bluetooth Low Energy Device.
```javascript
//Connecting to a device.
let connectedDevice = device;
bluetooth.connect(connectedDevice,(server) => {
    connectedDevice = device;
}
```
*Error*: Error message examples.

## Disonnecting
##### connectedDevice.disconnect(callback)
Method to disconnect to a Bluetooth Low Energy Device.
```javascript
//Disonnecting to a device.
connectedDevice.disconnect((err) => {
    console.log(error);
}
```
*Error*: Error message examples.

## Measuring the Distance
##### connectedDevice.read('distance', callback)
Method calculates the distance to the connected Bluetooth Low Energy Device.
```javascript
//Calculating the distance to a BLE device involves reading the RSSI and tX Power emitted from the device.
connectedDevice.read('distance', (distance) => {
    return distance;
}
```
*Error*: Error message examples.

## Event Based on Distance
##### connectedDevice.event('distance', distance_meters, callback)
Method fires an event based on the distance to the connected Bluetooth Low Energy Device.

`distance_meters`: distance in meters
```javascript
//Firing an event based on the distance to a BLE device. 
connectedDevice.read('distance', (distance) => {
    return distance;
}
```  
*Error*: Error message examples.

## Read the Eddystone URL
##### connectedDevice.read('url', callback)
Method gathers the Eddystone URL from the connected Bluetooth Low Energy Device.
```javascript
//Calculating the distance to a BLE device involved reading the RSSI and tX Power emitted from the device.
connectedDevice.read('url', (newUrl) => {
    connectedDevice.newUrl = 'www.google.com';
    return connectedDevice.newUrl;
}
```
*Error*: Error message examples.

## Write the Eddystone URL
##### connectedDevice.write('url', callback)
Method edits the Eddystone URL from the connected Bluetooth Low Energy Device.
```javascript
//Calculating the distance to a BLE device involved reading the RSSI and tX Power emitted from the device.
connectedDevice.write('url', (url) => {
    return url;
}
```
*Error*: Error message examples.
