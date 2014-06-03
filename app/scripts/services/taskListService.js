'use strict';

angular.module('whatNowApp')
  .factory('taskListService', ['$rootScope', 'taskDependencyService',
    function ($rootScope, TaskDependencyService) {
    
    var taskList = [];
    var newTaskId = 0;

    this.generateNewTask = function() {
      return { id: ++newTaskId };
    };

    this.getTaskList = function() {
      return taskList;
    };

    this.setTaskList = function(newTaskList) {
      // remove all previous elements, save the reference
      taskList.splice(0, taskList.length);

      // add all new elements, save the reference
      taskList.splice.apply(taskList, [taskList.length, 0].concat(newTaskList));
    };

    this.addTask = function(task) {
      if (!task.id) {
        task.id = ++newTaskId;
      }

      TaskDependencyService.buildDependencies(taskList, task);
      if (taskList.indexOf(task) === -1) {
        taskList.push(task);
      }

      this.selectTask(task);
    };

    this.removeTask = function(task) {
      var taskIndex = taskList.indexOf(task);
      if (taskIndex === -1) {
        throw 'Tried to remove a task that\'s not in the list.';
      }
      taskList.splice(taskIndex, 1);
      TaskDependencyService.removeFromDependencies(taskList, task);
    };

    this.selectTask = function(taskToSelect) {
      taskList.forEach(function(task) {
        task.isSelected = task == taskToSelect;
      });

      $rootScope.$broadcast('taskSelected', taskToSelect);
    };

    return this;
  }]);