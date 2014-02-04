# grunt-protractor-webdriver [![devDependency Status](https://david-dm.org/seckardt/grunt-protractor-webdriver/dev-status.png)](https://david-dm.org/seckardt/grunt-protractor-webdriver#info=devDependencies) [![NPM version](https://badge.fury.io/js/grunt-protractor-webdriver.png)](http://badge.fury.io/js/grunt-protractor-webdriver) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

> grunt plugin for starting Protractor's bundled Selenium Webdriver

[![Npm Downloads](https://nodei.co/npm/grunt-protractor-webdriver.png?downloads=true&stars=true)](https://nodei.co/npm/grunt-protractor-webdriver.png?downloads=true&stars=true)

This `Grunt` task starts a Selenium Webdriver, blocks until it's ready to accept connections, and then leaves it running in the background until the `Grunt` process finished. During startup it checks for already running Webdriver instances and at the end of the `Grunt` process also shuts down the Selenium server to not leave you with any zombies.

## Getting Started

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-protractor-webdriver --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-protractor-webdriver');
```

## The "protractor_webdriver" task

### Overview

In your project's Gruntfile, add a section named `protractor_webdriver` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  protractor_webdriver: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.command

Type: `String`
Default value: `webdriver-manager start`

Customize the way how the Selenium Webdriver is started. By default it assumes the presence of the `webdriver-manager` script (which comes bundled with `Protractor`) on the PATH.

#### options.path

Type: `String`
Default value: ``

Customize the path to the actual command that starts the the Selenium Webdriver. By default it assumes the presence of your script on the PATH.

### Usage Examples

```js
grunt.initConfig({
  protractor_webdriver: {
    your_target: {
      options: {
        path: '/path/to/',
        command: 'custom-webdriver-manager start',
      },
    },
  },
});
```

### Debugging

By default the output of the Selenium Webdriver is not being piped to the console by the `protractor_webdriver` task. In case you need detailed information about its state, just run your `Grunt` tasks with the `--verbose` flag.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* v0.1.4 - No code changes. Just had to push new release as v0.1.3 seems to be lost in the NPM repo...
* v0.1.3 - Fix regression of v0.1.2 with wrong Selenium server path being used. Add additional exit handlers for `.on('error')`, `.on('uncaughtException')` and `.on('SIGINT')`.
* v0.1.2 - Harden waiting for all browser sessions to be deleted before shutdown. Due to possible race-conditions with log statements for multiple browser sessions in one line, the session counter didn't work properly.
* v0.1.1 - Ensure waiting for eventual `Selenium is already running` message on failure. Ensure waiting for all browser sessions to be deleted before shutdown.
* v0.1.0 - Initial commit.

## License

Copyright (c) 2014 Steffen Eckardt. Licensed under the MIT license.