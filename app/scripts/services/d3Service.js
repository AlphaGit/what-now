'use strict';

// taken from http://www.ng-newsletter.com/posts/d3-on-angular.html
angular.module('whatNowApp')
  .factory('d3Service', ['$window', function ($window) {
    return $window.d3;
  }]);