/*
 * grunt-protractor-webdriver
 * https://github.com/seckardt/grunt-protractor-webdriver
 *
 * Copyright (c) 2014 Steffen Eckardt
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-protractor-runner');
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-shell');

	var path = require('path'),
		isWindows = process.platform === 'win32',
		ptorDir = 'node_modules' + (isWindows ? '/.' : '/protractor/') + 'bin/';

	// Project configuration.
	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'tasks/*.js'
			]
		},

		express: {
			server: {
				options: {
					port: 9999,
					hostname: 'localhost',
					server: 'server'
				}
			}
		},

		protractor_webdriver: {
			alive: {
				options: {
					path: ptorDir,
					keepAlive: true
				}
			},
			dead: {
				options: {
					path: ptorDir
				}
			}
		},

		protractor: {
			options: {
				configFile: 'protractor.conf.js',
				keepAlive: false
			},
			target1: {},
			target2: {}
		},

		shell: {
			protractor: {
				options: {
					stdout: true
				},
				command: path.resolve(ptorDir + 'webdriver-manager') + ' update --standalone --chrome'
			}
		}
	});


	grunt.registerTask('test', [
		'default',
		'express:server',
		'shell:protractor',
		'protractor_webdriver:alive',
		'protractor:target1',
		'protractor:target2',
		'protractor_webdriver:dead',
		'protractor:target1'
	]);

	grunt.registerTask('server', [
		'express:server',
		'express-keepalive'
	]);

	grunt.registerTask('default', ['jshint']);
};