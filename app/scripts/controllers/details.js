'use strict';

angular.module('whatNowApp')
  .controller('DetailsCtrl', ['$scope', '$q', 'taskListService',
    function ($scope, $q, TaskListService) {
      /***** Bound to scope ******/
      $scope.taskBeingEdited = {};

      $scope.submitForm = function() {
        TaskListService.addTask($scope.taskBeingEdited);
        $scope.taskBeingEdited = {};
      };

      $scope.$on('taskSelected', function(evt, selectedTask) {
        $scope.taskBeingEdited = selectedTask;
      });

      $scope.filteredTaskList = function(query) {
        var deferred = $q.defer();

        var filteredTasks = TaskListService.getPossibleDependencies($scope.taskBeingEdited, query);

        deferred.resolve(filteredTasks);

        return deferred.promise;
      };
    }
]);
