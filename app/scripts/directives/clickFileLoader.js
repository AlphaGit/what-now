'use strict';

angular.module('whatNowApp')
  .directive('clickFileLoader', [function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        onFileSelected: '='
      },
      template: '<div><input type="file" style="display: none" /><div ng-transclude /></div>',
      link: function($scope, element) {
        var input = element.find('input');
        
        element.on('click', function () {
          input[0].click();
        });

        input.on('change', function() {
          var file = input[0].files[0];
          if ($scope.onFileSelected) {
            $scope.onFileSelected(file);
          }
          input.val(null);
        });
      }
    };
  }]);
