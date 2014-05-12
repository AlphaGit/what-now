'use strict';

angular.module('whatNowApp')
  .factory('jQuery', ['$window', function ($window) {
    return $window.jQuery;
  }]);