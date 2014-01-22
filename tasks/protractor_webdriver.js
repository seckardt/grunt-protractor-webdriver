/**
 * `grunt-protractor-webdriver`
 *
 * Grunt task to start the `Selenium Webdriver` which comes bundled with
 * `Protractor`, the E2E test framework for Angular applications.
 *
 * Copyright (c) 2014 Steffen Eckardt
 * Licensed under the MIT license.
 *
 * @see https://github.com/seckardt/grunt-protractor-webdriver
 * @see https://github.com/angular/protractor
 * @see https://code.google.com/p/selenium/wiki/WebDriverJs
 * @see http://angularjs.org
 */

'use strict';

module.exports = function (grunt) {
	var spawn = require('child_process').spawn,
		http = require('http'),
		noop = function () {},
		REMOTE_REGEXP = /RemoteWebDriver instances should connect to: (.*)/,
		STARTED_REGEXP = /Started org\.openqa\.jetty\.jetty\.Server/,
		RUNNING_REGEXP = /Selenium is already running/,
		FAILURE_REGEXP = /Failed to start/,
		DONE_REGEXP = /Executing: \[delete session: (.*)\]/,
		SHUTDOWN_OK_REGEXP = /OKOK/,
		DEFAULT_CMD = 'webdriver-manager start',
		DEFAULT_INSTANCE = 'http://localhost:4444';

	function exec(command) {
		var file,
			args,
			opts = {
				cwd: process.cwd(),
				stdio: [process.stdin]
			};

		if (process.platform === 'win32') {
			file = 'cmd.exe';
			args = ['/s', '/c', command.replace(/\//g, '\\')];
			opts.windowsVerbatimArguments = true;
		} else {
			file = '/bin/sh';
			args = ['-c', command];
		}

		var proc = spawn(file, args, opts);
		proc.stdout.setEncoding('utf8');
		proc.stderr.setEncoding('utf8');
		return proc;
	}

	function Webdriver(context, options) {
		var done = context.async(),
			selenium,
			destroy,
			server = DEFAULT_INSTANCE;

		function start() {
			grunt.log.writeln('Starting'.cyan + ' Selenium server');

			selenium = exec(options.path + options.command);
			selenium.on('exit', exit);
			selenium.on('close', exit);

			selenium.stdout.on('data', data);
			selenium.stderr.on('data', data);

			destroy = exit(selenium);
		}

		function started(callback) {
			grunt.log.writeln('Started'.cyan + ' Selenium server: ' + server.green);
			if (callback) {
				callback();
			}
		}

		function stop(callback) {
			grunt.log.writeln('Shutting down'.cyan + ' Selenium server: ' + server);

			var response = '';
			http.get(server + '/selenium-server/driver/?cmd=shutDownSeleniumServer', function (res) {
				res.on('data',function (data) {
					response += data;
				}).on('end', function () {
					if (callback) {
						var success = SHUTDOWN_OK_REGEXP.test(response);
						grunt.log.writeln('Shut down'.cyan + ' Selenium server: ' + server + ' (' + (success ? response.green : response.red) + ')');
						callback(success);
					}
				});
			});
		}

		function exit(proc) {
			return function (callback) {
				proc.stdout.destroy();
				proc.stderr.destroy();

				callback = callback || function () {
					grunt.fatal('Selenium terminated unexpectedly');
				};

				stop(callback);
			};
		}

		function data(out) {
			grunt.verbose.writeln('SELENIUM: '.cyan + out);

			if (REMOTE_REGEXP.test(out)) {
				var result = REMOTE_REGEXP.exec(out);
				if (typeof result[1] === 'string' && result[1].trim().length > 0) {
					server = result[1].replace(/\/wd\/hub/, '');
				}
			} else if (STARTED_REGEXP.test(out)) {
				// Success
				started(done);
			} else if (RUNNING_REGEXP.test(out)) {
				// Webdriver instance is already running -> Trying to shutdown
				stop(function (success) {
					if (success) {
						// Shutdown succeeded -> Retry
						new Webdriver(context, options);
					} else {
						// Shutdown failed -> Exit
						destroy();
					}
				});
			} else if (FAILURE_REGEXP.test(out)) {
				// Failure -> Exit
				destroy();
			} else if (DONE_REGEXP.test(out)) {
				// Done -> Exit
				destroy(noop);
			}
		}

		start();
	}

	grunt.registerMultiTask('protractor_webdriver', 'grunt plugin for starting Protractor\'s bundled Selenium Webdriver', function () {
		new Webdriver(this, this.options({
			path: '',
			command: DEFAULT_CMD
		}));
	});
};
