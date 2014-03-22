'use strict';

// taken from http://www.ng-newsletter.com/posts/d3-on-angular.html
angular.module('whatNowApp')
  .factory('d3Service', ['$window', function ($window) {
    // bogus code to check if this does not get deleted from the build
    var service = {};
    service.d3 = $window.d3;

    return service.d3;
  }]);