const { expect, assert } = require('chai');

const { Bluetooth } = require('../lib/main.js');

describe('Unit Tests', function() {
	it('Should Require Bluetooth', function() {
		expect(Bluetooth).to.be.a('function');
		expect(Bluetooth.prototype).to.have.property('acquire');
	});
});