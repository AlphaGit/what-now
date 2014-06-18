'use strict';

describe('taskListService', function() {
  var service;
  var rootScope;

  beforeEach(function() {
    module('whatNowApp');

    inject(function($rootScope, taskListService) {
      rootScope = $rootScope;
      service = taskListService;
    });
  });

  describe('#addTask', function() {
    it('should be defined', function() {
      expect(service.addTask).toBeDefined();
    });

    it('should add a task to the task list when passed into it', function() {
      var task = 'some task';
      service.addTask(task);

      var tasks = service.getTaskList();
      expect(tasks.length).toBe(1);
      expect(tasks[0].name).toBe(task);
    });

    it('should not add the same task twice', function() {
      var task = new Task('test task');

      service.addTask(task);
      expect(service.getTaskList().length).toBe(1);

      service.addTask(task);
      expect(service.getTaskList().length).toBe(1);
    });

    it('should select the task', function() {
      var task = new Task('task');

      service.addTask(task);

      expect(task.isSelected).toBe(true);
    });

    it('should update the tasks to execute next', function() {
      var task1 = new Task('1');

      service.addTask(task1);
      rootScope.$digest();

      expect(task1.isSuggested).toBe(true);

      var task2 = new Task('2');
      task1.addPrevious(task2);
      service.addTask(task2);
      rootScope.$digest();

      expect(task1.isSuggested).toBe(false);
      expect(task2.isSuggested).toBe(true);

      var task3 = new Task('3');
      task2.addPrevious(task3);
      service.addTask(task3);
      rootScope.$digest();

      expect(task1.isSuggested).toBe(false);
      expect(task2.isSuggested).toBe(false);
      expect(task3.isSuggested).toBe(true);
    });

    it('should indicate two tasks as possible suggestions', function() {
      var task1 = new Task('1');
      var task2 = new Task('2');

      service.addTask(task1);
      rootScope.$digest();

      expect(task1.isSuggested).toBe(true);

      service.addTask(task2);
      rootScope.$digest();

      expect(task1.isSuggested).toBe(true);
      expect(task2.isSuggested).toBe(true);
    });
  });

  describe('#removeTask', function() {
    it('should be defined', function() {
      expect(service.removeTask).toBeDefined();
    });

    it('should remove the passed task from the task list', function() {
      var testTask = new Task('Testing');

      service.addTask(testTask);

      service.removeTask(testTask);

      expect(service.getTaskList().length).toBe(0);
    });

    it('should remove the dependencies for the tasks once a task is removed', function() {
      var task1 = new Task('1');
      var task2 = new Task('2');
      task2.addPrevious(task1);

      service.addTask(task1);
      service.addTask(task2);

      service.removeTask(task1);

      expect(task1.previous.length).toBe(0);
    });

    it('should throw an error if it tries to remove a task that\'s not on the list', function() {
      var task = { name: 'Testing' };

      var tryRemove = function() {
        service.removeTask(task);
      };

      expect(tryRemove).toThrow();
    });
  });

  describe('#selectTask', function() {
    it('should be defined', function() {
      expect(service.selectTask).toBeDefined();
    });

    it('should set the isSelected property on the task', function() {
      var task = new Task('test');

      service.addTask(task);
      service.selectTask(task);

      expect(task.isSelected).toBe(true);
    });

    it('should remove the isSelected property on other tasks', function() {
      var task1 = new Task('task1');
      var task2 = new Task('task2');
      task2.isSelected = true;

      service.addTask(task1);
      service.addTask(task2);

      service.selectTask(task1);

      expect(task2.isSelected).toBe(false);
    });

    it('should broadcast an event notifying the application that this task has been selected', function() {
      var task = new Task('test');
      spyOn(rootScope, '$broadcast');

      service.selectTask(task);

      expect(rootScope.$broadcast).toHaveBeenCalledWith('taskSelected', task);
    });
  });

  describe('#getFilteredTasks', function() {
    it('should be defined', function() {
      expect(service.getFilteredTasks).toBeDefined();
    });

    it('should return a list of tasks filtered by name', function() {
      var task1 = new Task('task1');
      var task2 = new Task('task2');
      var task3 = new Task('task3');

      task1.name = 'A';
      task2.name = 'B1';
      task3.name = 'B2';

      service.addTask(task1);
      service.addTask(task2);
      service.addTask(task3);

      var aFiltered = service.getFilteredTasks('A');
      expect(aFiltered).toBeDefined();
      expect(aFiltered.length).toBe(1);
      expect(aFiltered[0]).toBe(task1);

      var bFiltered = service.getFilteredTasks('B');
      expect(bFiltered).toBeDefined();
      expect(bFiltered.length).toBe(2);
      expect(bFiltered[0]).toBe(task2);
      expect(bFiltered[1]).toBe(task3);
    });

    it('should not differentiate based on casing', function() {
      var task1 = new Task('A');
      service.addTask(task1);

      var filtered = service.getFilteredTasks('a');

      expect(filtered.length).toBe(1);
      expect(filtered[0]).toBe(task1);
    });
  }); // #getFilteredTasks
});
