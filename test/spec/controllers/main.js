'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('whatNowApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of tasks to the scope', function () {
    expect(scope.tasks).toBeDefined();
  });

  describe('newTask object', function() {
    it('should be defined', function() {
      expect(scope.newTask).toBeDefined();
    });

    it('should start with an id of 1', function() {
      expect(scope.newTask.id).toBe(1);
    });
  });

  describe('addTask method', function() {
    it('should be defined', function() {
      expect(scope.addTask).toBeDefined();
    });

    it('should add a task to the task list when passed into it', function() {
      var task = 'some task';
      scope.addTask(task);

      expect(scope.tasks.length).toBe(1);
      expect(scope.tasks[0]).toBe(task);
    });
  });

  describe('addTaskFromForm method', function() {
    it('should be defined', function() {
      expect(scope.addTaskFromForm).toBeDefined();
    });

    it('should add the new task defined in the newTask object', function() {
      var testTask = { name: 'Testing' };
      scope.newTask = testTask;

      scope.addTaskFromForm();

      expect(scope.tasks.length).toBe(1);
      expect(scope.tasks[0]).toBe(testTask);
    });

    it('should unlink the newTask object from the recently added task', function() {
      var testTask = { name: 'Testing' };
      scope.newTask = testTask;

      scope.addTaskFromForm();

      expect(scope.newTask).not.toBe(testTask);
    });

    it('should increase the internal id of the new task each time a task is added', function() {
      scope.newTask = { id: 1, name: 'My task' };
      scope.addTaskFromForm();

      expect(scope.newTask.id).toBe(2);
    });
  });

  describe('removeTask method', function() {
    it('should be defined', function() {
      expect(scope.removeTask).toBeDefined();
    });

    it('should remove the passed task from the task list', function() {
      var testTask = { name: 'Testing' };

      scope.addTask(testTask);

      scope.removeTask(testTask);

      expect(scope.tasks.length).toBe(0);
    });

    it('should remove tasks when they are dependent of others too', function() {
      var task1 = { id: 0, name: 'first task', dependsOnText: '', dependsOn: [] };
      var task2 = { id: 1, name: 'second task', dependsOnText: '', dependsOn: [task1] };
      var task3 = { id: 2, name: 'third task', dependsOnText: '', dependsOn: [task1, task2] };

      scope.tasks = [task1, task2, task3];

      scope.removeTask(task1);

      expect(scope.tasks[0]).toBe(task2);
      expect(scope.tasks[1]).toBe(task3);

      expect(task2.dependsOn.length).toBe(0);
      expect(task3.dependsOn.length).toBe(1);
      expect(task3.dependsOn[0]).toBe(task2);
    });
  });

  describe('buildGraphDependencies method', function() {
    it('should be defined', function() {
      expect(scope.buildGraphDependencies).toBeDefined();
    });

    it('should be called whenever adding a task', function() {
      var wasCalled = false;
      scope.buildGraphDependencies = function() { wasCalled = true; };

      scope.addTask({ id: 0, name: 'test task', dependsOnText: '' });

      expect(wasCalled).toBe(true);
    });

    it('should link tasks when passed task has the ID of another', function() {
      scope.tasks = [{ id: 0, name: 'first task', dependsOnText: '', dependsOn: [] }];

      scope.addTask({ id: 1, name: 'second task', dependsOnText: '0' });

      expect(scope.tasks.length).toBe(2);
      expect(scope.tasks[1].id).toBe(1);
      expect(scope.tasks[1].dependsOn.length).toBe(1);
      expect(scope.tasks[1].dependsOn[0]).toBe(scope.tasks[0]);
    });

    it('should initialize the dependsOn array of the passed task', function() {
      var newTask = { id: 1, name: 'new task', dependsOnText: '' };

      scope.buildGraphDependencies(newTask);

      expect(newTask.dependsOn.length).toBe(0);
    });

    it('should support a list of dependencies in comma separated values', function() {
      scope.tasks = [
        { id: 0, name: 'first task', dependsOnText: '', dependsOn: [] },
        { id: 1, name: 'second task', dependsOnText: '', dependsOn: [] },
        { id: 2, name: 'third task', dependsOnText: '', dependsOn: [] }
      ];

      var newTask = { id: 3, name: 'depends on all', dependsOnText: '0,1,2' };
      scope.addTask(newTask);

      expect(newTask.dependsOn).toBeDefined();
      expect(newTask.dependsOn.length).toBe(3);
    });

    it('should ignore spaces in the comma separated list', function() {
      scope.tasks = [
        { id: 0, name: 'first task', dependsOnText: '', dependsOn: [] },
        { id: 1, name: 'second task', dependsOnText: '', dependsOn: [] },
        { id: 2, name: 'third task', dependsOnText: '', dependsOn: [] }
      ];

      var newTask = { id: 3, name: 'depends on all', dependsOnText: '0, 1    ,           2       ' };
      scope.addTask(newTask);

      expect(newTask.dependsOn).toBeDefined();
      expect(newTask.dependsOn.length).toBe(3);
    });
  });
});
