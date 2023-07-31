import DeviceDetector from "device-detector-js";

export default function DeepLinker(options) {
	if (!options) {
		throw new Error('no options')
	}

	let hasFocus = true;
	let didHide = false;

	function onBlur() {
		hasFocus = false;
	}

	function onVisibilityChange(e) {
		if (e.target.visibilityState === 'hidden') {
			didHide = true;
		}
	}

	function onFocus() {
		if (didHide) {
			if (options.onReturn) {
				options.onReturn();
			}

			didHide = false; // reset
		} else {
			if (!hasFocus && options.onFallback) {
				setTimeout(function () {
					if (!didHide) {
						options.onFallback();
					}
				}, 1000);
			}
		}

		hasFocus = true;
	}

	function bindEvents(mode) {
		[
			[window, 'blur', onBlur],
			[document, 'visibilitychange', onVisibilityChange],
			[window, 'focus', onFocus],
		].forEach(function (conf) {
			conf[0][mode + 'EventListener'](conf[1], conf[2]);
		});
	}

	bindEvents('add');

	function openLinkBasedOnDevice(deviceType, url) {

		const androidUrl = url.replace('https://' || 'http://', 'intent://');


		const pathArray = url.split('/');
		const protocol = pathArray[0];
		const host = pathArray[2];
		const hostUrl = protocol + '//' + host;

		const newUrl = new URL(url);
		const iosUrl = url.replace(hostUrl, `${newUrl.host.split('.')[1]}://${newUrl.host}`);

		console.log(iosUrl, 'iosUrl')
		/* window.open(iosUrl, '_blank'); */

		console.log(`${androidUrl}#Intent;package=com.${newUrl.host.split('.')[1]}.android;scheme=https;end`);


		console.log(url, 'urlurlurlurlurlurlurl');
		switch (deviceType) {
			case 'ios':
				window.location = iosUrl;
				break;
			case 'gnu/linux':
				window.location = `${androidUrl}#Intent;package=com.${newUrl.host.split('.')[1]}.mobile;scheme=https;end`;
				break;
			default:
				window.location.replace(url);
		}
	}

	// expose public API
	this.destroy = bindEvents.bind(null, 'remove');
	this.openURL = function (url) {
		// it can take a while for the dialog to appear
		let dialogTimeout = 500;

		setTimeout(function () {
			if (hasFocus && options.onIgnored) {
				options.onIgnored();
			}
		}, dialogTimeout);

		const deviceDetector = new DeviceDetector();

		const device = deviceDetector.parse(navigator.userAgent);

		openLinkBasedOnDevice(device.os.name.toLowerCase(), url);
	};
}
