'use strict';

angular.module('whatNowApp')
  .controller('TaskPersistenceCtrl', ['$scope', 'taskListService', 'taskSerializationService', 'filePersistenceService',
    function ($scope, TaskListService, TaskSerializationService, FilePersistenceService) {
      var ctrl = this;

      ctrl.saveTasks = function() {
        var taskList = TaskListService.getTaskList();
        var taskString = TaskSerializationService.serializeTasks(taskList);
        FilePersistenceService.saveToFile(taskString, 'taskList.txt');
      };

      ctrl.loadTasks = function(file) {
        if (!file)  {
          return;
        }

        FilePersistenceService.readFromFile(file).then(function(taskString) {
          var tasks = TaskSerializationService.deserializeTasks(taskString);
          TaskListService.setTaskList(tasks);
        });
      };

      /******** binding to scope *********/
      $scope.saveTasks = ctrl.saveTasks;
      $scope.loadTasks = ctrl.loadTasks;
    }
  ]);
