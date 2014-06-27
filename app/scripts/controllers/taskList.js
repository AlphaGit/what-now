'use strict';

angular.module('whatNowApp')
  .controller('TaskListCtrl', ['$scope', 'taskListService',
    function ($scope, TaskListService) {

      /******************** controller private members ********************/
      var ctrl = this;

      /******************** controller public members ********************/
      this.addTask = function() {
        var task = new Task('(New task)');
        TaskListService.addTask(task);
      };

      this.removeTask = function(taskToRemove) {
        TaskListService.removeTask(taskToRemove);
      };

      this.tasks = TaskListService.getTaskList();

      /******************** $scope bound members ********************/
      $scope.tasks = ctrl.tasks; // will keep being updated unless the array is regenerated

      $scope.addTask = ctrl.addTask;
      $scope.removeTask = ctrl.removeTask;

      $scope.selectTask = function(taskToSelect) {
        TaskListService.selectTask(taskToSelect);
      };

      $scope.getDependsOnText = function(task) {
        return task.previous.map(function(dependencyTask) {
          return dependencyTask.name;
        }).join(', ');
      };
    }
  ]);
