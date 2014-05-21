'use strict';

describe('taskDependencyService', function() {
  var service;
  beforeEach(function() {
    module('whatNowApp');

    inject(function(taskDependencyService) {
      service = taskDependencyService;
    });
  });

  describe('#buildDependencies', function() {
    it('should be defined', function() {
      expect(service.buildDependencies).toBeDefined();
    });

    it('should initialize the dependsOn array of the passed task', function() {
      var newTask = { id: 1, name: 'new task', dependsOnText: '' };

      service.buildDependencies([], newTask);

      expect(newTask.dependsOn.length).toBe(0);
    });

    it('should link tasks when passed task has the ID of another', function() {
      var firstTask = { id: 1, name: 'first task', dependsOnText: '', dependsOn: [] };
      var taskList = [firstTask];
      var newTask = { id: 2, name: 'second task', dependsOnText: '1', dependsOn: [] };

      service.buildDependencies(taskList, newTask);

      expect(newTask.dependsOn.length).toBe(1);
      expect(newTask.dependsOn[0]).toBe(firstTask);
    });

    it('should support a list of dependencies in comma separated values', function() {
      var taskList = [
        { id: 0, name: 'first task', dependsOnText: '', dependsOn: [] },
        { id: 1, name: 'second task', dependsOnText: '', dependsOn: [] },
        { id: 2, name: 'third task', dependsOnText: '', dependsOn: [] }
      ];

      var newTask = { id: 3, name: 'depends on all', dependsOnText: '0,1,2' };
      service.buildDependencies(taskList, newTask);

      expect(newTask.dependsOn).toBeDefined();
      expect(newTask.dependsOn.length).toBe(3);
    });

    it('should ignore spaces in the comma separated list', function() {
      var taskList = [
        { id: 0, name: 'first task', dependsOnText: '', dependsOn: [] },
        { id: 1, name: 'second task', dependsOnText: '', dependsOn: [] },
        { id: 2, name: 'third task', dependsOnText: '', dependsOn: [] }
      ];

      var newTask = { id: 3, name: 'depends on all', dependsOnText: '0, 1    ,           2       ' };
      service.buildDependencies(taskList, newTask);

      expect(newTask.dependsOn).toBeDefined();
      expect(newTask.dependsOn.length).toBe(3);
    });
  }); // #buildDependencies

  describe('#removeFromDependencies', function() {
    it('should remove tasks references from others', function() {
      var task1 = { id: 1, name: 'first task', dependsOn: [] };
      var task2 = { id: 2, name: 'second task', dependsOn: [task1] };
      var task3 = { id: 3, name: 'third task', dependsOn: [task1, task2] };

      var taskList = [task2, task3];

      service.removeFromDependencies(taskList, task1);

      expect(task2.dependsOn.length).toBe(0);
      expect(task3.dependsOn.length).toBe(1);
      expect(task3.dependsOn[0]).toBe(task2);
    });
  }); // #removeFromDependencies
});