const { assert, expect, should } = require('chai');
const sinon = require('sinon');

const { Bluetooth } = require('../lib/main.js');

describe('Unit Tests', function() {
	it('Bluetooth (exports object)', function() {
		expect(Bluetooth).to.be.a('object');
		expect(Bluetooth).to.not.be.null;
	});

	it('Bluetooth.acquire', function() {
		const navigatorMock = sinon.mock(navigator);
		const bluetooth = navigatorMock.expects('bluetooth');
		console.log(navigatorMock);
		expect(Bluetooth.acquire).to.be.a('function');
		// expect(Bluetooth.acquire).
		// Stub navigator.bluetooth.requestDevice
	});


});