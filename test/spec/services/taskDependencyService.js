'use strict';

describe('taskDependencyService', function() {
  var service;
  beforeEach(function() {
    module('whatNowApp');

    inject(function(taskDependencyService) {
      service = taskDependencyService;
    });
  });

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
