'use strict';

// taken from http://stackoverflow.com/a/23920706/147507
angular.module('whatNowApp')
  .directive('autofocusWhen', function ($timeout) {
    return {
      link: function(scope, element, attrs) {
        scope.$watch(attrs.autofocusWhen, function(newValue) {
          if (newValue) {
            $timeout(function() {
              element.focus();
            });
          }
        });
      }
    };
  });