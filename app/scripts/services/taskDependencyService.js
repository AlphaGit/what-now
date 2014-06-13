'use strict';

angular.module('whatNowApp')
  .factory('taskDependencyService', [function () {
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
