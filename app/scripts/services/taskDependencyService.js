'use strict';

angular.module('whatNowApp')
  .factory('taskDependencyService', [function () {
    this.buildDependencies = function(taskList, newTask) {
      newTask.dependsOn = [];

      var ids = newTask.dependsOnText ? newTask.dependsOnText.split(',') : [];
      
      for (var idIndex = 0; idIndex < ids.length; idIndex++) {
        var dependsOnId = parseInt(ids[idIndex], 10);

        // search for referenced task and link it
        var index = taskList.length;
        while (index--) {
          if (taskList[index].id === dependsOnId) {
            newTask.dependsOn.push(taskList[index]);
            break;
          }
        }
      }
    };

    this.removeFromDependencies = function (taskList, taskToRemove) {
      taskList.forEach(function(task) {
        var dependencyIndex = task.dependsOn.length;
        while (dependencyIndex--) {
          if (task.dependsOn[dependencyIndex] === taskToRemove) {
            task.dependsOn.splice(dependencyIndex, 1);
          }
        }
      });
    };

    return this;
  }]);