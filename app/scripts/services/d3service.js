// taken from http://www.ng-newsletter.com/posts/d3-on-angular.html
angular.module('d3', [])
  .factory('d3Service', ['$window', function ($window) {
    'use strict';

    return $window.d3;
  }]);