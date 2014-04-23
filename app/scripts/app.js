'use strict';

angular.module('whatNowApp', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function ($rootScope, $location) {
    $rootScope.isActiveRoute = function (path) {
      return $location.path() == path;
    };
  });
