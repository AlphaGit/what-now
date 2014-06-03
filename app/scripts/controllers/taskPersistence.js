'use strict';

angular.module('whatNowApp')
  .controller('TaskPersistenceCtrl', ['$scope', 'taskListService', 'filePersistenceService',
    function ($scope, TaskListService, FilePersistenceService) {
      var ctrl = this;

      ctrl.saveTasks = function() {
        var taskList = TaskListService.getTaskList();
        FilePersistenceService.saveToFile(taskList, 'taskList.txt');
      };

      ctrl.loadTasks = function(file) {
        if (!file)  {
          return;
        }

        FilePersistenceService.readFromFile(file).then(function(tasks) {
          TaskListService.setTaskList(tasks);
        });
      };

      /******** binding to scope *********/
      $scope.saveTasks = ctrl.saveTasks;
      $scope.loadTasks = ctrl.loadTasks;
    }
  ]);
