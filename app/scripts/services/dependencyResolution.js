angular.module('whatNowApp')
  .factory('dependencyResolutionService', [function () {
    'use strict';

    var dependencyResolutionService = {};

    dependencyResolutionService.arrangeInLayers = function (taskList) {
      var layers = [];

      if (!taskList || !taskList.length) {
        return layers;
      }

      var tasksToVisit = [];
      for (var i = taskList.length; i--;) {
        tasksToVisit.push(taskList[i]);
      }

      var visitedTasks = [];

      var taskToVisitIndex = tasksToVisit.length - 1;
      var currentLayer = [];
      var visitedInThisRound = [];

      while (tasksToVisit.length) {
        var currentTask = tasksToVisit[taskToVisitIndex];

        if (this.allDependenciesPresent(currentTask, visitedTasks)) {
          currentLayer.push(currentTask);
          tasksToVisit.splice(taskToVisitIndex, 1);
          visitedInThisRound.push(currentTask);
        }

        if (!taskToVisitIndex) {
          layers.push(currentLayer);
          currentLayer = [];
          while (visitedInThisRound.length) {
            visitedTasks.push(visitedInThisRound.pop());
          }

          taskToVisitIndex = tasksToVisit.length - 1;
        } else {
          taskToVisitIndex--;
        }
      }

      return layers;
    };

    dependencyResolutionService.allDependenciesPresent = function(task, availableDependencies) {
      var i = task.dependsOn.length;

      evaluatingRequiredDependency:
      while (i--) {
        var j = availableDependencies.length;
        while (j--) {
          if (availableDependencies[j] == task.dependsOn[i]) {
            continue evaluatingRequiredDependency;
          }
        }

        return false;
      }

      return true;
    };

    return dependencyResolutionService;
  }]);