/*global angular*/
angular.module('app', [])
	.controller('MainCtrl', ['$scope', function ($scope) {
		$scope.welcome = 'Hello World';
	}]);