exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	baseUrl: 'http://localhost:9999',
	rootElement: 'html',
	specs: ['test/e2e/*.spec.js'],
	allScriptsTimeout: 60000,
	chromeOnly: false,

	multiCapabilities: [{
		browserName: 'chrome'
	}, {
		browserName: 'firefox'
	}],

	jasmineNodeOpts: {
		onComplete: null,
		isVerbose: false,
		showColors: true,
		includeStackTrace: true,
		defaultTimeoutInterval: 60000
	}
};