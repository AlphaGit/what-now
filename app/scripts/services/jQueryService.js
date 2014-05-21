'use strict';

angular.module('whatNowApp')
  .factory('jQueryService', ['$window', function ($window) {
    return $window.jQuery;
  }]);