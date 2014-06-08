'use strict';

angular.module('whatNowApp')
  .controller('DetailsCtrl', ['$scope', 'taskListService',
    function ($scope, TaskListService) {
      /***** Bound to scope ******/
      $scope.taskBeingEdited = {};

      $scope.submitForm = function() {
        TaskListService.addTask($scope.taskBeingEdited);
        $scope.taskBeingEdited = {};
      };

      $scope.$on('taskSelected', function(evt, selectedTask) {
        $scope.taskBeingEdited = selectedTask;
      });
    }
]);