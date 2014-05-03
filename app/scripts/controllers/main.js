'use strict';

angular.module('whatNowApp')
  .controller('MainCtrl', ['$scope',
    function ($scope) {

/*
  Simplified design for this controller:

  controller:
    - generateNewTask
    - buildGraphDependencies (newTask)
      - dependencyIds <-- separate ids from comma separated list (UI)
      - for each dependencyId in dependencyIds
        - dependentTask <-- find task with that id in list
        - associate newTask to dependentTask
    - removeTask (function)
    - addTask (function)
      - add to taskList if not present already

  scope:
    - taskBeingEdited (task)
      - form bound to taskBeingEdited
    - tasks (array)
    - submitForm (function)
      - add to list
      - generate new newTask
      - taskBeingEdited <-- newTask
    - editTask
      - taskBeingEdited <-- selected task (from UI)
    - remove task
      - remove selected task (from UI) from list
*/

      /******************** controller private members ********************/
      var ctrl = this;

      var buildGraphDependencies = function(newTask) {
        newTask.dependsOn = [];

        var ids = newTask.dependsOnText ? newTask.dependsOnText.split(',') : [];
        
        for (var idIndex = 0; idIndex < ids.length; idIndex++) {
          var dependsOnId = parseInt(ids[idIndex], 10);

          // search for referenced task and link it
          var index = ctrl.tasks.length;
          while (index--) {
            if (ctrl.tasks[index].id === dependsOnId) {
              newTask.dependsOn.push(ctrl.tasks[index]);
              break;
            }
          }
        }
      };

      /******************** controller public members ********************/
      this.addTask = function(task) {
        buildGraphDependencies(task);
        if (this.tasks.indexOf(task) === -1) {
          this.tasks.push(task);
        }
      };

      this.removeTask = function(taskToRemove) {
        var index = this.tasks.length;
        while (index--) {
          var task = this.tasks[index];
          if (task === taskToRemove) {
            this.tasks.splice(index, 1);
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

      this.generateNewTask = function() {
        return { id: ++this.lastTaskId };
      };

      this.lastTaskId = 0;
      this.tasks = [];

      /******************** $scope bound members ********************/
      $scope.tasks = ctrl.tasks; // will keep being updated unless the array is regenerated
      $scope.taskBeingEdited = ctrl.generateNewTask();
      $scope.editingExistingTask = false;

      $scope.submitForm = function() {
        ctrl.addTask($scope.taskBeingEdited);
        $scope.taskBeingEdited = ctrl.generateNewTask();
        $scope.editingExistingTask = false;
      };

      $scope.removeTask = function(taskToRemove) {
        ctrl.removeTask(taskToRemove);
      };

      $scope.editTask = function(taskToEdit) {
        $scope.editingExistingTask = true;
        $scope.taskBeingEdited = taskToEdit;
      };

      $scope.selectTask = function(taskToSelect) {
        $scope.tasks.forEach(function(task) {
          task.isSelected = task == taskToSelect;
        });
      };
    }
  ]);