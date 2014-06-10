'use strict';

angular.module('whatNowApp')
  .factory('taskDependencyService', [function () {
    function rebuildDependencyText(task) {
      var dependsOnIds = task.dependsOn.map(function(t) {
        return t.id;
      });
      task.dependsOnText = dependsOnIds.join(', ');
    }

    this.buildDependencies = function(taskList, newTask) {
      newTask.dependsOn = [];

      var ids = newTask.dependsOnText ? newTask.dependsOnText.split(',') : [];
      
      for (var idIndex = 0; idIndex < ids.length; idIndex++) {
        var dependsOnId = parseInt(ids[idIndex], 10);
        if (dependsOnId == newTask.id) {
          continue;
        }

        // search for referenced task and link it
        var index = taskList.length;
        while (index--) {
          if (taskList[index].id === dependsOnId) {
            newTask.dependsOn.push(taskList[index]);
            break;
          }
        }
      }

      rebuildDependencyText(newTask);
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