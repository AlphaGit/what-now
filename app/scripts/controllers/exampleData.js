'use strict';

angular.module('whatNowApp')
  .controller('ExampleDataCtrl', ['taskListService',
    function (TaskListService) {
      for (var i = 1; i <= 6; i++) {
        TaskListService.generateNewTask(); // simulate generation of tasks 1 through 6
      }

      var task1 = { id: 1, name: 'Sort clothes',    dependsOnText: '',     isCompleted: true };
      var task2 = { id: 2, name: 'Load washer',     dependsOnText: '1',    isCompleted: false };
      var task3 = { id: 3, name: 'Prepare rounds',  dependsOnText: '1',    isCompleted: false };
      var task4 = { id: 4, name: 'Laundry',         dependsOnText: '2, 3', isCompleted: false };
      var task5 = { id: 5, name: 'Find sock pairs', dependsOnText: '3',    isCompleted: false };
      var task6 = { id: 6, name: 'Profit!',         dependsOnText: '4, 5', isCompleted: false };

      TaskListService.addTask(task1);
      TaskListService.addTask(task2);
      TaskListService.addTask(task3);
      TaskListService.addTask(task4);
      TaskListService.addTask(task5);
      TaskListService.addTask(task6);
    }
]);

