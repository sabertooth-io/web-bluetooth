const { assert, expect, should } = chai;
let apiDevice;

describe('Raw API', function() {
	it('connects to a device', function() {
		expect(typeof apiDevice).to.equal('object');
	});
});

class Button {
	constructor(parentId, textContent, onClick) {
		this.node = document.createElement('button');
		this.parentNode = document.getElementById(parentId);
		this.node.innerHTML = `<h3 style="color: firebrick">${textContent}</h3>`;
		this.node.addEventListener('click', onClick);
	}

	append() {
		this.parentNode.appendChild(this.node);
	}
}

function acquireDeviceRaw(filters) {
	navigator.bluetooth.requestDevice(filters)
		.then(device => {
			apiDevice = device;
			mocha.run();
		})
		.catch(err => {
			console.error(`ERROR: Unable to acquire device\n ${err}`);
		});
}

const permissionsButton = new Button('permissions', 'Request Device', () => acquireDeviceRaw({filters: [{ namePrefix: "P" }]}));
permissionsButton.append();
