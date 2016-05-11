// const { assert, expect, should } = require('chai');
// const sinon = require('sinon');

// const { Bluetooth } = require('../lib/main.js');

describe('Unit Tests', function() {
	it('Bluetooth (exports object)', function() {
		expect(Bluetooth).to.be.a('object');
		expect(Bluetooth).to.not.be.null;
	});

	it('Bluetooth.acquire', function() {
		expect(Bluetooth.acquire).to.be.a('function');

		// Stub navigator.bluetooth.requestDevice
		const requestDeviceStub = sinon.stub(navigator.bluetooth, 'requestDevice');
		console.log(requestDeviceStub);
	});


});