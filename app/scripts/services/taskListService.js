'use strict';

angular.module('whatNowApp')
  .factory('taskListService', ['$rootScope',
    function ($rootScope) {

    var taskList = [];

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
      if (!(task instanceof Task)) {
        task = new Task(task);
      }

      if (taskList.indexOf(task) === -1) {
        taskList.push(task);
      }

      this.selectTask(task);
    };

    this.removeTask = function(taskToRemove) {
      var taskIndex = taskList.indexOf(taskToRemove);
      if (taskIndex === -1) {
        throw 'Tried to remove a task that\'s not in the list.';
      }
      taskList.splice(taskIndex, 1);

      taskList.forEach(function(task) {
        task.removePrevious(taskToRemove);
      });
    };

    this.selectTask = function(taskToSelect) {
      taskList.forEach(function(task) {
        task.isSelected = task == taskToSelect;
      });

      $rootScope.$broadcast('taskSelected', taskToSelect);
    };

    this.getPossibleDependencies = function(forTask, filter) {
      filter = filter.toLowerCase();
      var nameMatchingTasks = taskList.filter(function(task) {
        return task.name.toLowerCase().indexOf(filter) === 0;
      });

      if (!(forTask instanceof Task)) {
        return nameMatchingTasks;
      }

      return nameMatchingTasks.filter(function(task) {
        return forTask.canAddAsPrevious(task);
      });
    };

    var hasAllDependenciesComplete = function (task) {
      return task.previous.length === 0 || task.previous.every(function (dependentTask) {
        return dependentTask.isComplete;
      });
    };

    var sumArray = function (array) {
      return array.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue;
      }, 0);
    };

    var getTaskTreeSize = function (task) {
      var innerTreeSize = task.next ? sumArray(task.next.map(getTaskTreeSize)) : 0;
      return 1 + innerTreeSize;
    };

    var getTaskTreeLength = function (task) {
      return 1 + Math.max.apply(null, task.next.map(getTaskTreeLength).concat([0]));
    };

    var recalculateSuggestedTasks = function() {
      // simple cases
      if (taskList.length === 0) { return; }
      if (taskList.length === 1) {
        taskList[0].isSuggested = true;
        return;
      }

      // other cases calculations
      taskList.forEach(function (task) {
        task.isSuggested = false;
      });

      var tasksWithDependenciesComplete = taskList.filter(hasAllDependenciesComplete);
      if (tasksWithDependenciesComplete.length == 1) {
        tasksWithDependenciesComplete[0].isSuggested = true;
        return;
      }

      var taskTreeSize = tasksWithDependenciesComplete.map(getTaskTreeSize);

      var tasksWithBiggestTrees = taskTreeSize.reduce(function (previousValue, currentValue, index) {
        var current = { task: tasksWithDependenciesComplete[index], treeSize: currentValue };
        if (currentValue > previousValue[0].treeSize) {
          return [current];
        } else if (currentValue == previousValue[0].treeSize) {
          previousValue.push(current);
          return previousValue;
        } else {
          return previousValue;
        }
      }, [ { task: null, treeSize: 0 } ]);

      if (tasksWithBiggestTrees.length == 1 && tasksWithBiggestTrees[0].task !== null) {
        tasksWithBiggestTrees[0].task.isSuggested = true;
        return;
      }

      var getTask = function(objectWithTask) {
        return objectWithTask.task;
      };

      var taskTreeLength = tasksWithBiggestTrees.map(getTask).map(getTaskTreeLength);

      var tasksWithLongestTrees = taskTreeLength.reduce(function (previousValue, currentValue, index) {
        var current = { task: tasksWithBiggestTrees[index].task, treeLength: currentValue };
        if (currentValue > previousValue[0].treeLength) {
          return [current];
        } else if (currentValue == previousValue[0].treeLength) {
          previousValue.push(current);
          return previousValue;
        } else {
          return previousValue;
        }
      }, [ { task: null, treeLength: 0 } ]);

      tasksWithLongestTrees.forEach(function (taskContainer) {
        taskContainer.task.isSuggested = true;
      });
    };

    $rootScope.$watch(function() {
      return taskList.map(function(task) {
        return {
          name: task.name,
          nextCount: task.next.length,
          previousCount: task.previous.length,
          isComplete: task.isComplete
        };
      });
    }, recalculateSuggestedTasks, true);

    return this;
  }]);
