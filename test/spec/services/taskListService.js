'use strict';

describe('taskListService', function() {
  var service;
  var taskDependencyServiceMock = {
    buildDependencies: function() { },
    removeFromDependencies: function() { }
  };
  var rootScopeMock = {
    $broadcast: function() {}
  };

  beforeEach(function() {
    module('whatNowApp');

    module(function ($provide) {
      $provide.value('taskDependencyService', taskDependencyServiceMock);
      $provide.value('$rootScope', rootScopeMock);
    });

    inject(function(taskListService) {
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
      expect(tasks[0]).toBe(task);
    });

    it('should not add the same task twice', function() {
      var task = service.generateNewTask();

      service.addTask(task);
      expect(service.getTaskList().length).toBe(1);

      service.addTask(task);
      expect(service.getTaskList().length).toBe(1);
    });

    it('should assign an id to the task if it doesn\'t have one', function() {
      var task = { name: 'task' };

      service.addTask(task);

      expect(task.id).toBeTruthy();
    });

    it('should select the task', function() {
      var task = { name: 'task' };

      service.addTask(task);

      expect(task.isSelected).toBe(true);
    });
  });

  describe('#removeTask', function() {
    it('should be defined', function() {
      expect(service.removeTask).toBeDefined();
    });

    it('should remove the passed task from the task list', function() {
      var testTask = { name: 'Testing' };

      service.addTask(testTask);

      service.removeTask(testTask);

      expect(service.getTaskList().length).toBe(0);
    });

    it('should call the task dependency service to remove the dependencies for the task', function() {
      spyOn(taskDependencyServiceMock, 'removeFromDependencies');

      var task = { name: 'Testing' };

      service.addTask(task);
      service.removeTask(task);

      expect(taskDependencyServiceMock.removeFromDependencies).toHaveBeenCalledWith(jasmine.any(Object), task);
    });

    it('should throw an error if it tries to remove a task that\'s not on the list', function() {
      var task = { name: 'Testing' };

      var tryRemove = function() {
        service.removeTask(task);
      };

      expect(tryRemove).toThrow();
    });
  });

  describe('#generateNewTask', function() {
    it('should return a new task each time', function() {
      var task1 = service.generateNewTask();
      var task2 = service.generateNewTask();

      expect(task1).not.toBe(task2);
      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe('#selectTask', function() {
    it('should be defined', function() {
      expect(service.selectTask).toBeDefined();
    });

    it('should set the isSelected property on the task', function() {
      var task = service.generateNewTask();

      service.addTask(task);
      service.selectTask(task);

      expect(task.isSelected).toBe(true);
    });

    it('should remove the isSelected property on other tasks', function() {
      var task1 = service.generateNewTask();
      var task2 = service.generateNewTask();
      task2.isSelected = true;

      service.addTask(task1);
      service.addTask(task2);

      service.selectTask(task1);

      expect(task2.isSelected).toBe(false);
    });

    it('should broadcast an event notifying the application that this task has been selected', function() {
      var task = service.generateNewTask();
      spyOn(rootScopeMock, '$broadcast');

      service.selectTask(task);

      expect(rootScopeMock.$broadcast).toHaveBeenCalledWith('taskSelected', task);
    });
  });

  describe('#getFilteredTasks', function() {
    it('should be defined', function() {
      expect(service.getFilteredTasks).toBeDefined();
    });

    it('should return a list of tasks filtered by name', function() {
      var task1 = service.generateNewTask();
      var task2 = service.generateNewTask();
      var task3 = service.generateNewTask();

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
      var task1 = service.generateNewTask();
      task1.name = 'A';
      service.addTask(task1);

      var filtered = service.getFilteredTasks('a');

      expect(filtered.length).toBe(1);
      expect(filtered[0]).toBe(task1);
    });
  }); // #getFilteredTasks
});
