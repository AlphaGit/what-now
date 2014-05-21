'use strict';

angular.module('whatNowApp')
  .controller('ChartCtrl', ['$scope', 'taskListService',
    function ($scope, TaskListService) {
      $scope.tasks = TaskListService.getTaskList();
    }
  ]);