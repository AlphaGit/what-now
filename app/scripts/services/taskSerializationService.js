'use strict';

angular.module('whatNowApp')
  .factory('taskSerializationService', ['$window', function ($window) {
    var taskSerializationService = {};

    taskSerializationService.serializeTasks = function(tasks) {
      return $window.JSON.stringify(tasks, function(key, value) {
        if (key === 'next' || key === 'previous') {
          return value.map(function (task) {
            return { $taskId: task.taskId };
          });
        }
        return value;
      });
    };

    taskSerializationService.deserializeTasks = function(taskString) {
      var parsedTasks = $window.JSON.parse(taskString);

      var findByTaskId = function(taskId) {
        return parsedTasks.find(function (task) {
          return task.taskId == taskId;
        });
      };

      var getReferencesFromIdArray = function(idArray) {
        return idArray.map(function(task) {
          return findByTaskId(task.$taskId);
        });
      };

      parsedTasks = parsedTasks.map(function(parsedTask) {
        var taskObject = new Task(parsedTask.name);
        taskObject.isSuggested = parsedTask.isSuggested;
        taskObject.isComplete = parsedTask.isComplete;
        taskObject.isSelected = parsedTask.isSelected;
        taskObject.taskId = parsedTask.taskId;

        // these will be parsed later on
        taskObject.next = parsedTask.next;
        taskObject.previous = parsedTask.previous;
        return taskObject;
      });

      parsedTasks.forEach(function(task) {
        task.next = getReferencesFromIdArray(task.next);
        task.previous = getReferencesFromIdArray(task.previous);
      });

      return parsedTasks;
    };

    return taskSerializationService;
  }]);