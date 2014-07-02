'use strict';

angular.module('whatNowApp')
  .controller('DetailsCtrl', ['$scope', '$q', 'taskListService',
    function ($scope, $q, TaskListService) {
      /***** Bound to scope ******/
      $scope.taskBeingEdited = {};
      $scope.selectedDependencies = [];

      $scope.submitForm = function() {
        $scope.taskBeingEdited.previous = $scope.selectedDependencies;
        TaskListService.addTask($scope.taskBeingEdited);
        $scope.taskBeingEdited = {};
        $scope.selectedDependencies = [];
      };

      $scope.$on('taskSelected', function(evt, selectedTask) {
        $scope.taskBeingEdited = selectedTask;
        $scope.selectedDependencies = [].concat(selectedTask.previous);
      });

      $scope.filteredTaskList = function(query) {
        var deferred = $q.defer();

        var filteredTasks = TaskListService.getPossibleDependencies($scope.taskBeingEdited, query);

        deferred.resolve(filteredTasks);

        return deferred.promise;
      };

      $scope.addPrevious = function(previousTask) {
        if ($scope.taskBeingEdited instanceof Task) {
          $scope.taskBeingEdited.addPrevious(previousTask);
        }
      };

      $scope.removePrevious = function(previousTask) {
        if ($scope.taskBeingEdited instanceof Task) {
          $scope.taskBeingEdited.removePrevious(previousTask);
        }
      };
    }
]);
