'use strict';

angular.module('whatNowApp')
  .controller('MainCtrl', ['$scope',
    function ($scope) {
      $scope.tasks = [];
      $scope.newTask = { id: 1 };

      $scope.addTask = function(task) {
        $scope.tasks.push(task);
        $scope.buildGraphDependencies(task);
      };

      $scope.addTaskFromForm = function() {
        $scope.addTask($scope.newTask);
        $scope.newTask = { id: $scope.newTask.id + 1 };
      };

      $scope.removeTask = function(taskToRemove) {
        var index = $scope.tasks.length;
        while (index--) {
          var task = $scope.tasks[index];
          if (task === taskToRemove) {
            $scope.tasks.splice(index, 1);
          } else {
            var dependencyIndex = task.dependsOn.length;
            while (dependencyIndex--) {
              if (task.dependsOn[dependencyIndex] === taskToRemove) {
                task.dependsOn.splice(dependencyIndex, 1);
              }
            }
          }
        }
      };

      $scope.buildGraphDependencies = function(newTask) {
        newTask.dependsOn = [];

        var ids = newTask.dependsOnText ? newTask.dependsOnText.split(',') : [];
        
        for (var idIndex = 0; idIndex < ids.length; idIndex++) {
          var dependsOnId = parseInt(ids[idIndex], 10);

          // search for referenced task and link it
          var index = $scope.tasks.length;
          while (index--) {
            if ($scope.tasks[index].id === dependsOnId) {
              newTask.dependsOn.push($scope.tasks[index]);
              break;
            }
          }
        }
      };
    }
  ]);